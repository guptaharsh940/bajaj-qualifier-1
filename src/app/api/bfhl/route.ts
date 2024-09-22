import { NextRequest, NextResponse } from 'next/server';
import mime from 'mime-types';

// Define types for the file details
interface FileDetails {
    file_valid: boolean;
    file_mime_type: string;
    file_size_kb: string;
}

// Helper function to decode base64 string and get file details
function processBase64File(file_b64: string): FileDetails {
    try {
        const mimeMatch = file_b64.match(/^data:(.*?);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'unknown';

        // Remove MIME type prefix if it exists to get the raw base64 string
        const base64Data = mimeMatch ? file_b64.replace(/^data:(.*?);base64,/, '') : file_b64;

        // Create a buffer from the base64 string
        const buffer = Buffer.from(base64Data, 'base64');
        const fileSizeKB = buffer.length / 1024; // Size in KB

        // Check if MIME type is valid (not 'unknown')
        const fileValid = mimeType !== 'unknown';

        return {
            file_valid: fileValid,
            file_mime_type: mimeType,
            file_size_kb: fileSizeKB.toFixed(2)};
    } catch (error) {
        // If there's an error processing the file, return invalid details
        return {
            file_valid: false,
            file_mime_type: 'unknown',
            file_size_kb: '0'
        };
    }
}

// Define the expected shape of the POST request body
interface RequestBody {
    data: (string | number)[];
    file_b64?: string;
}

// Define the response structure
interface ApiResponse {
    is_success: boolean;
    user_id: string;
    email: string;
    roll_number: string;
    numbers: string[];
    alphabets: string[];
    highest_lowercase_alphabet: string[];
    file_valid: boolean;
    file_mime_type: string;
    file_size_kb: string;
}

// GET method
export async function GET(req: NextRequest): Promise<NextResponse> {
    // Return the operation_code for the GET method
    return NextResponse.json({ operation_code: 1 }, { status: 200 });
}

// POST method
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Extract data from the request body
        const { data, file_b64 }: RequestBody = await req.json();

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
                numbers.push(String(item));
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
        const fileDetails: FileDetails = file_b64 ? processBase64File(file_b64) : { file_valid: false, file_mime_type: 'unknown', file_size_kb: '0' };

        // Prepare the response
        const response: ApiResponse = {
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
