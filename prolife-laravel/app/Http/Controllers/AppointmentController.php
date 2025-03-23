<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentRequestMail;

class AppointmentController extends Controller
{
    public function sendAppointmentEmail(Request $request)
    {
        // Validate form data
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required',
            'services' => 'required',
            'date' => 'required|date',
        ]);

        // Prepare email data
        $details = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'services' => $request->input('services'),
            'date' => $request->input('date'),
        ];

        // Send email
        Mail::to('senteujoshua@gmail.com')->send(new AppointmentRequestMail($details));

        return response()->json(['message' => 'Appointment request sent successfully!'], 200);
    }
}
