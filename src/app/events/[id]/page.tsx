"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/initSupabase";
import { Database } from "../../../../lib/schema";
import FormatDate from "@/app/components/date";
import { useRouter } from "next/navigation";
import useUnifiedSession from "@/app/components/Auth/useUnifiedSession";

type Event = Database["public"]["event"];

const Page = ({ params }: { params: { id: number } }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const router = useRouter();
  const { isAuthenticated, user } = useUnifiedSession();

  useEffect(() => {
    const getEvent = async () => {
      let { data: event, error } = await supabase
        .from("events")
        .select("*, users(id,email,name)")
        .eq("id", params.id)
        .single();
      setEvent(event);
    };
    getEvent();
  }, []);

  const handleDeleteEvent = async () => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error(error);
    } else {
      router.push("/events");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col">
          {event && (
            <>
              <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                {event.name}
              </h1>
              <p>Host: {event.users.name || "unknown"}</p>
              <p>Category: {event.category}</p>
              <p>Type: {event.type}</p>
              <p>Place: {event.event_place}</p>
              <p>
                Date begin at: <FormatDate dateString={event.event_date_at} />
              </p>
              <p>
                Date begin end: <FormatDate dateString={event.event_date_end} />
              </p>
              <p>Description: {event.description}</p>
              <p>
                Date created: <FormatDate dateString={event.created_at} />
              </p>
              {isAuthenticated && user?.email === event.users.email && (
                <>
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={handleDeleteEvent}
                  >
                    Delete this event
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
                    onClick={() => router.push(`/events/${event.id}/edit`)}
                  >
                    Update this event
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
