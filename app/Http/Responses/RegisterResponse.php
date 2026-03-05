<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $redirect = $request->input('redirect', route('dashboard'));

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false])
            : redirect()->to($redirect);
    }
}
