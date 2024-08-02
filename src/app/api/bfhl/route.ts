import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Return the operation_code
    return NextResponse.json({ operation_code: 1 }, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        // Extract data from the request body
        const { data } = await req.json();

        // Input validation: Ensure data is an array
        if (!Array.isArray(data)) {
            return NextResponse.json({ is_success: false, message: 'Invalid input format' }, { status: 400 });
        }

        // Initialize arrays for numbers and alphabets
        const numbers: string[] = [];
        const alphabets: string[] = [];

        // Separate numbers and alphabets
        data.forEach(item => {
            if (!isNaN(Number(item))) {
                numbers.push(item);
            } else if (typeof item === 'string' && /^[a-zA-Z]$/.test(item)) {
                alphabets.push(item);
            }
        });
        const unsortedalpha: string[] = [...alphabets];
        // Determine the highest alphabet (case insensitive)
        const highestAlphabet = alphabets.length > 0 ? [alphabets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).slice(-1)[0]] : [];

        // Prepare the response
        const response = {
            is_success: true,
            user_id: "john_doe_17091999",
            email: "john@xyz.com",
            roll_number: "ABCD123",
            numbers,
            alphabets:unsortedalpha,
            highest_alphabet: highestAlphabet
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        // Handle errors and return a response
        return NextResponse.json({ is_success: false, message: 'Internal server error' }, { status: 500 });
    }
}
