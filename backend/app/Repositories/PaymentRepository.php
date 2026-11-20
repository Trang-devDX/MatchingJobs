<?php

namespace App\Repositories;

use App\Exceptions\NotFoundException;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

class PaymentRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Payment);
    }

    public function insert(array $attributes): Payment
    {
        /** @var Payment $payment */
        $payment = $this->model->newQuery()->create($attributes);

        return $payment;
    }

    public function updatePayment(Payment $payment, array $attributes): Payment
    {
        $payment->update($attributes);

        return $payment->refresh();
    }

    public function findForCompany(string $companyId, string $id): Payment
    {
        $payment = $this->model->newQuery()
            ->where('company_id', $companyId)
            ->with('company')
            ->find($id);

        if (! $payment instanceof Payment) {
            throw new NotFoundException('Payment not found.');
        }

        return $payment;
    }

    public function recentForCompany(string $companyId, int $limit = 10): Collection
    {
        return $this->model->newQuery()
            ->where('company_id', $companyId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public function lock(string $id): ?Payment
    {
        $payment = $this->model->newQuery()->whereKey($id)->lockForUpdate()->first();

        return $payment instanceof Payment ? $payment : null;
    }
}
