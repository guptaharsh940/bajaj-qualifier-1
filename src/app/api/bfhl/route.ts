import { NextRequest, NextResponse } from 'next/server';

// Helper function to decode base64 string and get file details
function processBase64File(file_b64: string) {
    try {
        const buffer = Buffer.from(file_b64, 'base64');
        const mimeType = require('mime-types').lookup(buffer);
        const fileSizeKB = buffer.length / 1024; // Size in KB

        // Check validity of the file by checking MIME type
        const fileValid = mimeType !== false;
        
        return {
            file_valid: fileValid,
            file_mime_type: mimeType || 'unknown',
            file_size_kb: fileSizeKB.toFixed(2)
        };
    } catch (error) {
        // If there's an error processing the file, return invalid details
        return {
            file_valid: false,
            file_mime_type: 'unknown',
            file_size_kb: '0'
        };
    }
}

export async function GET(req: NextRequest) {
    // Return the operation_code for the GET method
    return NextResponse.json({ operation_code: 1 }, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        // Extract data from the request body
        const { data, file_b64 } = await req.json();

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

        // Determine the highest lowercase alphabet
        const lowercaseAlphabets = alphabets.filter(item => /^[a-z]$/.test(item));
        const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
            ? [lowercaseAlphabets.sort((a, b) => a.localeCompare(b)).slice(-1)[0]]
            : [];

        // File handling
        const fileDetails = file_b64 ? processBase64File(file_b64) : { file_valid: false, file_mime_type: 'unknown', file_size_kb: '0' };

        // Prepare the response
        const response = {
            is_success: true,
            user_id: "john_doe_17091999",
            email: "john@xyz.com",
            roll_number: "ABCD123",
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet,
            file_valid: fileDetails.file_valid,
            file_mime_type: fileDetails.file_mime_type,
            file_size_kb: fileDetails.file_size_kb
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        // Handle errors and return a response
        return NextResponse.json({ is_success: false, message: 'Internal server error' }, { status: 500 });
    }
}
