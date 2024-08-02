'use client';

import { useEffect, useState } from "react";
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

type OutputType = {
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
  error?: string;
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<OutputType>({ numbers: [], alphabets: [], highest_alphabet: [] });
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<{ value: string, label: string }>>([]);
  const [isSubmit, setSubmit] = useState<boolean>(false);

  const animatedComponents = makeAnimated();
  const options = [
    { value: 'alpha', label: 'Alphabets' },
    { value: 'num', label: 'Numbers' },
    { value: 'highalpha', label: 'Highest alphabet' }
  ];

  // Function to validate JSON
  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to handle button click
  const handleSubmit = async () => {
    if (validateJson(input)) {
      setSubmit(true);
      try {
        const response = await fetch("/api/bfhl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(JSON.parse(input)),
        });

        if (response.ok) {
          const data = await response.json();
          setOutput({
            numbers: data.numbers || [],
            alphabets: data.alphabets || [],
            highest_alphabet: data.highest_alphabet || [],
            error: undefined
          });
        } else {
          setOutput({
            numbers: [],
            alphabets: [],
            highest_alphabet: [],
            error: "Error fetching data"
          });
        }
      } catch (error) {
        setOutput({
          numbers: [],
          alphabets: [],
          highest_alphabet: [],
          error: "An error occurred."
        });
      }
    } else {
      alert("Invalid JSON");
    }
  };

  useEffect(() => {
    if (isSubmit) {
      // Logic to filter data based on selectedOptions
    }
  }, [selectedOptions, isSubmit]);

  return (
    <div>
      <div className="m-20 border border-gray-300 rounded-lg flex flex-col gap-2 p-4">
        <div className="relative w-full">
          <label className="absolute top-[-8px] left-2 bg-white px-1 text-gray-700 text-sm">
            API Input
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 pl-6"
            placeholder="Enter text"
          />
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {isSubmit && (
          <>
            <div className="relative mt-5 mb-5">
              <label className="absolute top-[-10px] left-2 bg-white px-1 text-gray-700 text-sm">
                Multi-select
              </label>
              <div className="border border-gray-300 rounded-lg p-2">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={options}
                  onChange={(newValue) => setSelectedOptions(newValue as MultiValue<{ value: string, label: string }>)}
                />
              </div>
            </div>

            {(output?.error === undefined) ? (
              <div>
                <h1 className="font-bold">Filtered Response</h1>
                {selectedOptions.some(option => option.value === 'num') && output.numbers.length > 0 && (
                  <p>
                    Numbers: {output.numbers.join(", ")}
                  </p>
                )}
                {selectedOptions.some(option => option.value === 'alpha') && output.alphabets.length > 0 && (
                  <p>
                    Alphabets: {output.alphabets.join(", ")}
                  </p>
                )}
                {selectedOptions.some(option => option.value === 'highalpha') && output.highest_alphabet.length > 0 && (
                  <p>
                    Highest Alphabet: {output.highest_alphabet.join(", ")}
                  </p>
                )}
              </div>
            ):(<div>{output.error}</div>)}
          </>
        )}
      </div>
    </div>
  );
}
