<?php

namespace App\Services\Files;

use App\Enums\UploadedFileTypeEnum;
use App\Exceptions\BusinessException;
use App\Models\UploadedFile as StoredUpload;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileStore
{
    public function apply(
        ?string $currentPath,
        ?UploadedFile $file,
        bool $remove,
        string $directory,
        UploadedFileTypeEnum $type,
        ?string $actorId,
        callable $persist,
    ): mixed {
        if (! $file && ! $remove) {
            return $persist($currentPath);
        }

        $storedPath = $file ? $this->put($file, $directory) : null;

        try {
            return DB::transaction(function () use ($persist, $storedPath, $currentPath, $file, $type, $actorId) {
                /** @var Model $owner */
                $owner = $persist($storedPath);

                if ($file && $storedPath) {
                    $owner->uploadedFiles()->create([
                        'type' => $type->value,
                        'name' => $file->getClientOriginalName() ?: basename($storedPath),
                        'path' => $storedPath,
                        'content_type' => $file->getMimeType() ?: 'application/octet-stream',
                        'size' => $file->getSize() ?: 0,
                        'storage_disk' => $this->disk(),
                        'created_by' => $actorId,
                    ]);
                }

                if ($currentPath && $currentPath !== $storedPath) {
                    $this->forget($currentPath, $actorId);
                }

                return $owner;
            });
        } catch (\Throwable $exception) {
            if ($storedPath) {
                $this->deleteBytes($storedPath);
            }

            throw $exception;
        }
    }

    public function discard(?string $path, ?string $actorId = null): void
    {
        if (! $path) {
            return;
        }

        $this->forget($path, $actorId);
    }

    public function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $disk = StoredUpload::query()->where('path', $path)->value('storage_disk') ?: $this->disk();

        return Storage::disk($disk)->url($path);
    }

    private function put(UploadedFile $file, string $directory): string
    {
        $extension = $file->extension() ?: 'bin';
        $name = Str::uuid()->toString().'.'.$extension;
        $path = Storage::disk($this->disk())->putFileAs($directory, $file, $name, ['visibility' => 'public']);

        if ($path === false) {
            throw new BusinessException('Could not store the file.');
        }

        return $path;
    }

    private function forget(string $path, ?string $actorId): void
    {
        $records = StoredUpload::query()->where('path', $path)->get();
        $disks = $records->pluck('storage_disk')->filter()->unique()->values()->all();

        $records->each(function (StoredUpload $record) use ($actorId): void {
            $record->deleted_by = $actorId;
            $record->save();
            $record->delete();
        });

        DB::afterCommit(function () use ($path, $disks): void {
            foreach ($disks === [] ? [$this->disk()] : $disks as $disk) {
                Storage::disk($disk)->delete($path);
            }
        });
    }

    private function disk(): string
    {
        return config('filesystems.default') === 's3' ? 's3' : 'public';
    }
}
