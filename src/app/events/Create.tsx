import React, { FormEvent, useRef, useState } from "react";
import { supabase } from "../../../lib/initSupabase";
import useUnifiedSession from "../components/Auth/useUnifiedSession";
import { z } from "zod";
import Spinner from "../components/UI/Spinner";
import { eventCategories, eventTypes } from "../../../lib/data";
import Alerts from "../components/UI/Alerts";

interface initialStateMessage {
  name: string;
  event_date_at: string;
  event_date_end: string;
  event_place: string;
  category: string;
  type: string;
  description: string;
}

const Create = () => {
  const [errorText, setErrorText] = useState<initialStateMessage | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseState, setResponseState] = useState(false);
  const { user } = useUnifiedSession();
  const ref = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const schema = z.object({
    name: z.string().min(3),
    event_date_at: z.string(),
    event_date_end: z.string(),
    category: z.string(),
    type: z.string(),
    description: z.string(),
    event_place: z.string(),
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isLoading) {
      return <Spinner />;
    }

    try {
      const formData = new FormData(e.currentTarget);

      const validatedFields = schema.safeParse({
        name: formData.get("name"),
        event_date_at: formData.get("event_date_at"),
        event_date_end: formData.get("event_date_end"),
        category: formData.get("category"),
        type: formData.get("type"),
        description: formData.get("description"),
        event_place: formData.get("event_place"),
      });

      if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        setErrorText(fieldErrors);

        return false;
      }

      const { data: userId } = await supabase
        .from("users")
        .select("id")
        .eq("email", user?.email)
        .single();

      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            name: formData.get("name"),
            event_date_at: formData.get("event_date_at"),
            event_date_end: formData.get("event_date_end"),
            category: formData.get("category"),
            event_place: formData.get("event_place"),
            type: formData.get("type"),
            description: formData.get("description"),
            author_id: parseInt(userId?.id),
          },
        ])
        .select();

      setResponseState(true);
      ref.current?.reset();
      if (error) {
        setResponseText("Error: " + error);
      } else {
        setResponseText("Your event has been added!");
      }
    } catch (error) {
      // Capture the error message to display to the user
      if (error instanceof Error) {
        let errorMessage = error.message;
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Create a new event!
      </h1>

      <form ref={ref} onSubmit={onSubmit} className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Event name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Name event"
              name="name"
              onChange={() => {
                setErrorText(null);
              }}
            />
            {errorText && errorText.hasOwnProperty("name") && (
              <Alerts message={errorText.name[0]} />
            )}
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Event category
            </label>
            <select
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="category"
              onChange={() => {
                setErrorText(null);
              }}
            >
              {eventCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errorText && errorText.hasOwnProperty("category") && (
              <Alerts message={errorText.category[0]} />
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Event date begin
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="date"
              name="event_date_at"
              placeholder="Date event at"
              onChange={() => {
                setErrorText(null);
              }}
            />
            {errorText && errorText.hasOwnProperty("event_date_at") && (
              <Alerts message={errorText.event_date_at[0]} />
            )}
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Event date end
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="date"
              name="event_date_end"
              placeholder="Date event end"
              onChange={() => {
                setErrorText(null);
              }}
            />
            {errorText && errorText.hasOwnProperty("event_date_end") && (
              <Alerts message={errorText.event_date_end[0]} />
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Event type
            </label>
            <select
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="type"
              onChange={() => {
                setErrorText(null);
              }}
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errorText && errorText.hasOwnProperty("type") && (
              <Alerts message={errorText.type[0]} />
            )}
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Event place
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="event_place"
              placeholder="place"
              onChange={() => {
                setErrorText(null);
              }}
            />
            {errorText && errorText.hasOwnProperty("event_place") && (
              <Alerts message={errorText.event_place[0]} />
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Event description
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="description"
              placeholder="description"
              onChange={() => {
                setErrorText(null);
              }}
            />
            {errorText && errorText.hasOwnProperty("description") && (
              <Alerts message={errorText.description[0]} />
            )}
          </div>
        </div>

        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          type="submit"
        >
          Add
        </button>
      </form>
      {responseState && (
        <div
          className={`p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400`}
          role="alert"
        >
          <span className="font-medium">{responseText}</span>
        </div>
      )}
    </>
  );
};

export default Create;
