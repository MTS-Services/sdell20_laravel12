<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Lpa;
use App\Models\Payment;
use App\Models\User;
use App\Models\Will;
use App\Support\LpaAdminEmailSummary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $role = $request->string('role')->lower()->toString();
        $search = $request->string('search')->trim();

        $usersQuery = User::query()
            ->select('id', 'name', 'email', 'is_admin', 'account_status', 'created_at')
            ->withCount(['payments', 'wills', 'lpas'])
            ->latest();

        if ($role === 'admin') {
            $usersQuery->where('is_admin', true);
        } elseif ($role === 'user') {
            $usersQuery->where('is_admin', false);
        }

        $searchValue = $search->toString();

        if ($searchValue !== '') {
            $usersQuery->where(function ($query) use ($searchValue) {
                $query->where('name', 'like', "%{$searchValue}%")
                    ->orWhere('email', 'like', "%{$searchValue}%");
            });
        }

        return Inertia::render('backend/Admin/Users/Index', [
            'users' => $usersQuery->paginate(15)->withQueryString(),
            'totalUsers' => User::count(),
            'currentFilter' => $role ?: 'all',
            'search' => $searchValue,
            'statusOptions' => User::ACCOUNT_STATUS_OPTIONS,
        ]);
    }

    public function show(User $user): Response
    {
        return Inertia::render('backend/Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'account_status' => $user->account_status,
                'created_at' => $user->created_at?->toDateTimeString(),
                'updated_at' => $user->updated_at?->toDateTimeString(),
            ],
            'statusOptions' => User::ACCOUNT_STATUS_OPTIONS,
        ]);
    }

    public function details(User $user): Response
    {
        $user->load([
            'payments' => fn($query) => $query->latest(),
            'wills' => fn($query) => $query->latest(),
            'lpas' => fn($query) => $query->latest(),
        ]);

        $paymentsSucceeded = $user->payments->filter(
            fn(Payment $payment) => $payment->status === PaymentStatus::Complete
        )->count();

        return Inertia::render('backend/Admin/Users/Details', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'account_status' => $user->account_status,
                'created_at' => $user->created_at?->toDateTimeString(),
                'updated_at' => $user->updated_at?->toDateTimeString(),
            ],
            'activity' => [
                'payments_count' => $user->payments->count(),
                'payments_succeeded_count' => $paymentsSucceeded,
                'wills_count' => $user->wills->count(),
                'lpas_count' => $user->lpas->count(),
            ],
            'payments' => $user->payments->map(function (Payment $payment) {
                $status = $payment->status instanceof PaymentStatus
                    ? $payment->status
                    : PaymentStatus::tryFrom((string) $payment->status) ?? PaymentStatus::Pending;

                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'currency' => $payment->currency,
                    'status' => $status->value,
                    'status_label' => $status->label(),
                    'product' => $payment->getProduct()?->value,
                    'product_label' => $payment->getProduct()?->label(),
                    'stripe_payment_intent_id' => $payment->stripe_payment_intent_id,
                    'created_at' => $payment->created_at?->toDateTimeString(),
                ];
            })->values()->all(),
            'wills' => $user->wills->map(function (Will $will) {
                return [
                    'id' => $will->id,
                    'will_type' => $will->will_type,
                    'status' => $will->status,
                    'is_draft' => $will->is_draft,
                    'paid_at' => $will->paid_at?->toDateTimeString(),
                    'amount' => $will->amount,
                    'payment_reference' => $will->payment_reference,
                    'created_at' => $will->created_at?->toDateTimeString(),
                ];
            })->values()->all(),
            'lpas' => $user->lpas->map(function (Lpa $lpa) use ($user) {
                $lpa->setRelation('user', $user);

                return [
                    'id' => $lpa->id,
                    'document_type' => $lpa->document_type,
                    'who_for' => $lpa->who_for,
                    'status' => $lpa->status,
                    'is_draft' => $lpa->is_draft,
                    'paid_at' => $lpa->paid_at?->toDateTimeString(),
                    'amount' => $lpa->amount,
                    'payment_reference' => $lpa->payment_reference,
                    'created_at' => $lpa->created_at?->toDateTimeString(),
                    'summary_sections' => LpaAdminEmailSummary::sections($lpa),
                ];
            })->values()->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('backend/Admin/Users/Create', [
            'statusOptions' => User::ACCOUNT_STATUS_OPTIONS,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'is_admin' => $validated['is_admin'] ?? false,
            'account_status' => $validated['account_status'] ?? 'active',
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('backend/Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'account_status' => $user->account_status,
                'created_at' => $user->created_at?->toDateTimeString(),
            ],
            'statusOptions' => User::ACCOUNT_STATUS_OPTIONS,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        $validated['is_admin'] = $validated['is_admin'] ?? false;
        $validated['account_status'] = $validated['account_status'] ?? $user->account_status ?? 'active';

        $user->update($validated);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()?->is($user)) {
            return redirect()
                ->route('admin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
