<?php

namespace App\Repositories;

use App\Exceptions\NotFoundException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Base repository class providing common database operations.
 *
 * This abstract class implements basic CRUD and query operations
 * that can be used by all repository implementations.
 */
abstract class BaseRepository
{
    /**
     * The model instance associated with the repository.
     *
     * @var Model
     */
    protected Model $model;

    /**
     * BaseRepository constructor.
     *
     * @param Model $model The model instance to be used by the repository.
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records.
     *
     * @param  array      $columns The columns to retrieve
     * @return Collection Collection of all records
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->all($columns);
    }

    /**
     * Get paginated records.
     *
     * @param  int                  $perPage Number of items per page
     * @param  array                $columns The columns to retrieve
     * @return LengthAwarePaginator Paginated results
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->paginate($perPage, $columns);
    }

    /**
     * Find a record by its ID (supports both UUID and integer).
     *
     * @param  int|string $id The ID to search for
     * @return Model|null The found model or null
     */
    public function find(int|string $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Find a record by its ID or fail.
     *
     * @param  int|string        $id The ID to search for
     * @throws NotFoundException If model not found
     * @return Model             The found model
     */
    public function findOrFail(int|string $id): Model
    {
        $model = $this->model->find($id);

        if (!$model) {
            throw new NotFoundException('Resource not found with ID: ' . $id);
        }

        return $model;
    }

    /**
     * Find a record by its ID including soft-deleted records or fail.
     *
     * @param  int|string        $id The ID to search for
     * @throws NotFoundException If model not found
     * @return Model             The found model
     */
    public function findOrFailWithTrashed(int|string $id): Model
    {
        $model = $this->model->withTrashed()->find($id);

        if (!$model) {
            throw new NotFoundException('Resource not found with ID: ' . $id);
        }

        return $model;
    }

    /**
     * Create a new record.
     *
     * @param  array $attributes The attributes for the new record
     * @return Model The created model
     */
    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    /**
     * Update an existing record.
     *
     * @param  int|string        $id         The ID of the record to update
     * @param  array             $attributes The attributes to update
     * @throws NotFoundException If model not found
     * @return Model             The updated model
     */
    public function update(int|string $id, array $attributes): Model
    {
        $record = $this->findOrFail($id);

        $record->update($attributes);

        return $record->refresh();
    }

    /**
     * Update or create a record.
     *
     * @param  array $attributes The search attributes
     * @param  array $values     The values to update/create
     * @return Model The updated or created model
     */
    public function updateOrCreate(array $attributes, array $values = []): Model
    {
        return $this->model->updateOrCreate($attributes, $values);
    }

    /**
     * Update multiple records.
     *
     * @param  array $ids        The IDs of the records to update
     * @param  array $attributes The attributes to update
     * @return int   Number of affected rows
     */
    public function updateMultiple(array $ids, array $attributes): int
    {
        return $this->model->whereIn($this->model->getKeyName(), $ids)->update($attributes);
    }

    /**
     * Delete a record.
     *
     * @param  int|string        $id The ID of the record to delete
     * @throws NotFoundException If model not found
     * @return bool              True if deletion successful, false otherwise
     */
    public function delete(int|string $id): bool
    {
        $record = $this->findOrFail($id);

        return $record->delete() ?? false;
    }

    /**
     * Soft delete a record (if model supports soft deletes).
     *
     * @param  int|string        $id The ID of the record to soft delete
     * @throws NotFoundException If model not found
     * @return bool              True if soft deletion successful
     */
    public function softDelete(int|string $id): bool
    {
        $record = $this->findOrFail($id);

        if (!in_array(SoftDeletes::class, class_uses_recursive($record), true)) {
            throw new \BadMethodCallException('Model does not support soft deletes');
        }

        return $record->delete() ?? false;
    }

    /**
     * Restore a soft deleted record.
     *
     * @param  int|string        $id The ID of the record to restore
     * @throws NotFoundException If model not found
     * @return bool              True if restoration successful
     */
    public function restore(int|string $id): bool
    {
        $record = $this->model->withTrashed()->find($id);

        if (!$record) {
            throw new NotFoundException('Resource not found with ID: ' . $id);
        }

        if (method_exists($record, 'restore')) {
            return $record->restore();
        }

        throw new \BadMethodCallException('Model does not support soft deletes');
    }

    /**
     * Find records matching given criteria.
     *
     * @param  array      $criteria The search criteria
     * @return Collection Collection of matching records
     */
    public function findWhere(array $criteria): Collection
    {
        return $this->model->where($criteria)->get();
    }

    /**
     * Find first record matching given criteria.
     *
     * @param  array      $criteria The search criteria
     * @return Model|null The found model or null if not found
     */
    public function findWhereFirst(array $criteria): ?Model
    {
        return $this->model->where($criteria)->first();
    }

    /**
     * Find first record matching given criteria or fail.
     *
     * @param  array             $criteria The search criteria
     * @throws NotFoundException If no matching record found
     * @return Model             The found model
     */
    public function findWhereFirstOrFail(array $criteria): Model
    {
        $record = $this->findWhereFirst($criteria);

        if (!$record instanceof Model) {
            throw new NotFoundException('Resource not found with given criteria');
        }

        return $record;
    }

    /**
     * Check if record exists with given criteria.
     *
     * @param  array $criteria The search criteria
     * @return bool  True if record exists
     */
    public function exists(array $criteria): bool
    {
        return $this->model->where($criteria)->exists();
    }

    /**
     * Get the model instance.
     *
     * @return Model
     */
    public function getModel(): Model
    {
        return $this->model;
    }

    /**
     * Set the model instance.
     *
     * @param  Model $model
     * @return static
     */
    public function setModel(Model $model): static
    {
        $this->model = $model;

        return $this;
    }

    /**
     * Filter the query results by a case-insensitive search.
     */
    protected function whereLikeInsensitive(
        EloquentBuilder|QueryBuilder $query,
        string $column,
        string $value
    ): EloquentBuilder|QueryBuilder {
        $grammar = $query instanceof EloquentBuilder
            ? $query->getQuery()->getGrammar()
            : $query->getGrammar();

        return $query->whereRaw(
            'LOWER(' . $grammar->wrap($column) . ') LIKE ?',
            ['%' . strtolower($value) . '%']
        );
    }
}
