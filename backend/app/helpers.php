<?php

use App\Exceptions\ConflictException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

if (!function_exists('auth_user_id')) {
    /**
     * Current user id
     */
    function auth_user_id(): ?string
    {
        if (Auth::user()) {
            // Logged in
            return Auth::user()?->user_id;
        }
        return null;
    }
}

if (!function_exists('logs')) {
    /**
     * Get a log channel instance
     * @param string $channel
     * @return \Psr\Log\LoggerInterface
     */
    function logs(string $channel = 'stack'): \Psr\Log\LoggerInterface
    {
        try {
            return \Illuminate\Support\Facades\Log::channel($channel);
        } catch (\Exception $e) {
            return \Illuminate\Support\Facades\Log::channel('single');
        }
    }
}

if (!function_exists('check_version_conflict')) {
    /**
     * Check if the version conflict
     */
    function check_version_conflict(Model $model, string $timestamp): void
    {
        $clientVersion = new \DateTime($timestamp);
        $serverVersion = new \DateTime($model->updated_at);

        if ($clientVersion < $serverVersion) {
            throw new ConflictException(
                'Data has been modified. Please update again.',
            );
        }
    }
}

if (!function_exists('logo_url')) {
    function logo_url(): string
    {
        return env('LOGO_URL', '');
    }
}

if (!function_exists('get_highlighted_content')) {
    /**
     * Get highlighted content based on search query.
     *
     * @param string $content
     * @param string $searchQuery
     * @return string
     */
    function get_highlighted_content(string $content, ?string $searchQuery = null): string
    {
        if (!$searchQuery || !trim($searchQuery) || !$content || empty($searchQuery)) {
            return $content;
        }

        return highlight_text($content, $searchQuery);
    }

    /**
     * Highlight matching text in content.
     *
     * @param string $text
     * @param string $query
     * @return string
     */
    function highlight_text(string $text, string $query): string
    {
        if (!$query || !trim($query)) {
            return $text;
        }

        // Split search query into individual terms
        $searchTerms = array_filter(explode(' ', trim($query)));

        if (empty($searchTerms)) {
            return $text;
        }

        // Sort terms by length (longest first) to handle overlapping matches better
        usort($searchTerms, function ($a, $b) {
            return strlen($b) - strlen($a);
        });

        $highlightedText = mb_strtolower($text);
        $originalText = $text;
        $positions = [];

        foreach ($searchTerms as $term) {
            if (strlen($term) < 2) {
                continue;
            }

            $term = mb_strtolower($term);
            $pos = 0;

            while (($pos = mb_strpos($highlightedText, $term, $pos)) !== false) {
                $positions[] = [
                    'start' => $pos,
                    'length' => mb_strlen($term),
                ];
                $pos += mb_strlen($term);
            }
        }

        // Sort positions in reverse order to not affect other positions when inserting tags
        usort($positions, function ($a, $b) {
            return $b['start'] - $a['start'];
        });

        // Insert highlight tags
        foreach ($positions as $position) {
            $before = mb_substr($originalText, 0, $position['start']);
            $match = mb_substr($originalText, $position['start'], $position['length']);
            $after = mb_substr($originalText, $position['start'] + $position['length']);

            $originalText = $before . '<mark class="bg-yellow-200 px-1 rounded-sm font-medium text-gray-900">' . $match . '</mark>' . $after;
        }

        return $originalText;
    }
}
