'use client';

import { useState } from "react";
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

type OutputType = {
  numbers: string | undefined;
  alphabets: string | undefined;
  highest_alphabet: string | undefined;
  error: string | undefined;
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<OutputType>();
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<{ value: string, label: string }>>([]);

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
      try {
        const response = await fetch("/api/bfhl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(JSON.parse(input)),
        });

        const data = await response.json();

        if (response.ok) {
          // Filter data based on selected options
          const selectedValues = selectedOptions.map(option => option.value);
          const filteredData: OutputType = {
            numbers: selectedValues.includes('num') ? data.numbers : undefined,
            alphabets: selectedValues.includes('alpha') ? data.alphabets : undefined,
            highest_alphabet: selectedValues.includes('highalpha') ? data.highest_alphabet : undefined,
            error: undefined
          };



          setOutput(filteredData);
        } else {
          setOutput({
            numbers: undefined,
            alphabets: undefined,
            highest_alphabet: undefined,
            error: "Error fetching data."
          });
        }
      } catch (error) {
        setOutput({
          numbers: undefined,
          alphabets: undefined,
          highest_alphabet: undefined,
          error: "An error occurred."
        });
      }
    } else {
      alert("Invalid JSON");
    }
  };

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

        <div>
          <h1 className="font-bold">Filtered Response</h1>
          
          <p>{output?.numbers && (
            <>
              Numbers: {output.numbers}
            </>
          )}</p>
          <p>{output?.alphabets && (
            <>
              Alphabets: {output.alphabets}
            </>
          )}</p>
          <p>{output?.highest_alphabet && (
            <>
              Highest Alphabet: {output.highest_alphabet}
            </>
          )}</p>
        </div>
      </div>
    </div>
  );
}
