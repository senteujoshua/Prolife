<?php

use Illuminate\Support\Facades\Route;


use App\Http\Controllers\AppointmentController;

Route::post('/send-appointment-email', [AppointmentController::class, 'sendAppointmentEmail']);
