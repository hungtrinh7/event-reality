"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../../../lib/initSupabase";
import { Database } from "../../../../../lib/schema";
import { useRouter } from "next/navigation";

type Event = Database["public"]["event"];

const Page = ({ params }: { params: { id: number } }) => {
  const [event, setEvent] = useState<Event>(null);
  const router = useRouter();
  const [responseText, setResponseText] = useState("");
  const [responseState, setResponseState] = useState(false);
  const [errorText, setErrorText] = useState("");

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

    const { data, error } = await supabase
      .from("events")
      .update({
        name: event.name,
        event_date_at: event.eventDateAt,
        event_date_end: event.eventDateEnd,
        category: event.category,
        type: event.type,
        description: event.description,
      })
      .eq("id", params.id)
      .select();

    setResponseState(true);
    if (error) {
      setResponseText("Error: " + error);
    } else {
      setResponseText("Your event has been updated!");
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
                  value={event?.name}
                  name="name"
                  onChange={(e) => {
                    setErrorText("");
                    setEvent({ ...event, name: e.target.value });
                  }}
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Event category
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  name="category"
                  placeholder="category"
                  value={event?.category}
                  onChange={(e) => {
                    setErrorText("");
                    setEvent({ ...event, category: e.target.value });
                  }}
                />
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
                  value={event?.event_date_at}
                  onChange={(e) => {
                    setErrorText("");
                    setEvent({ ...event, event_date_at: e.target.value });
                  }}
                />
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
                  value={event?.event_date_end}
                  onChange={(e) => {
                    setErrorText("");
                    setEvent({
                      ...event,
                      event_date_end: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Event type
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  name="type"
                  placeholder="type"
                  value={event?.type}
                  onChange={(e) => {
                    setErrorText("");
                    setEvent({ ...event, type: e.target.value });
                  }}
                />
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
                  value={event?.description}
                  onChange={(e) => {
                    setErrorText("");
                    setEvent({ ...event, description: e.target.value });
                  }}
                />
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
