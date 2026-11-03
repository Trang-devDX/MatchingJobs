<?php

namespace App\Http\Requests\Concerns;

trait NullsBlankStrings
{
    protected function nullIfBlank(string $key): void
    {
        $value = $this->input($key);
        if ($value === '' || $value === null) {
            $this->merge([$key => null]);
        }
    }
}
