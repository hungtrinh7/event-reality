"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../../../lib/initSupabase";
import { Database } from "../../../../../lib/schema";
import { z } from "zod";
import Spinner from "@/app/components/UI/Spinner";
import Alerts from "@/app/components/UI/alerts";
import { eventCategories, eventTypes } from "../../../../../lib/data";

type Event = Database["public"]["Tables"]["events"]["Update"];

interface initialStateMessage {
  name: string;
  event_date_at: string;
  event_date_end: string;
  event_place: string;
  category: string;
  type: string;
  description: string;
}

const Page = ({ params }: { params: { id: number } }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [responseState, setResponseState] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<initialStateMessage | null>(null);
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

  useEffect(() => {
    const callEvent = async () => {
      const { data: eventFromApi } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single();
      const dateEventBeginAt = new Date(eventFromApi.event_date_at);
      const formattedDateEventBeginAt = dateEventBeginAt
        .toISOString()
        .split("T")[0];
      const dateEventBeginEnd = new Date(eventFromApi.event_date_end);
      const formattedDateEventBeginEnd = dateEventBeginEnd
        .toISOString()
        .split("T")[0];
      // const timeString = dateEventBeginAt
      //   .toISOString()
      //   .split("T")[1]
      //   .slice(0, 5);

      setEvent({
        ...eventFromApi,
        event_date_at: formattedDateEventBeginAt,
        event_date_end: formattedDateEventBeginEnd,
      });
    };
    callEvent();
  }, []);

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

      const { data, error } = await supabase
        .from("events")
        .update({
          name: formData.get("name"),
          event_date_at: formData.get("event_date_at"),
          event_date_end: formData.get("event_date_end"),
          category: formData.get("category"),
          type: formData.get("type"),
          description: formData.get("description"),
          event_place: formData.get("event_place"),
        })
        .eq("id", params.id)
        .select();

      setResponseState(true);
      if (error) {
        setResponseText("Error: " + error);
      } else {
        setResponseText("Your event has been updated!");
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Update event
          </h1>

          <form onSubmit={onSubmit} className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Event name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  placeholder="Name event"
                  defaultValue={event?.name}
                  name="name"
                  onChange={(e) => {
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
                  defaultValue={event?.category}
                  onChange={() => {
                    setErrorText(null);
                  }}
                >
                  {eventCategories.map((category) => (
                    <option value={category}>{category}</option>
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
                  defaultValue={event?.event_date_at}
                  onChange={(e) => {
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
                  defaultValue={event?.event_date_end}
                  onChange={(e) => {
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
                    <option value={type}>{type}</option>
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
                  defaultValue={event?.event_place}
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
                  defaultValue={event?.description}
                  onChange={(e) => {
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
              Update
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
        </div>
      </main>
    </div>
  );
};

export default Page;
