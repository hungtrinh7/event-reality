"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/initSupabase";
import { Database } from "../../lib/schema";
import Date from "./components/date";

type Events = Database["public"]["Tables"]["events"]["Row"];

export default function Home() {
  const [events, setEvents] = useState<Events[] | null>([]);

  useEffect(() => {
    const callEvents = async () => {
      const { data: events, error } = await supabase.from("events").select("*");
      setEvents(events);
    };
    callEvents();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            List of events
          </h1>

          <table id="table-auto border-collapse">
            <thead>
              <tr>
                <th>
                  <span className="flex items-center">ID</span>
                </th>
                <th>
                  <span className="flex items-center">Name</span>
                </th>
                <th>
                  <span className="flex items-center">Category</span>
                </th>
                <th>
                  <span className="flex items-center">Type</span>
                </th>
                <th>
                  <span className="flex items-center">Date begin</span>
                </th>
                <th>
                  <span className="flex items-center">Date end</span>
                </th>
                <th>
                  <span className="flex items-center">Place / Address</span>
                </th>
                <th>
                  <span className="flex items-center">Description</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {events ? (
                events.map((event) => (
                  <tr key={event.id}>
                    <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {event.id}
                    </td>
                    <td>{event.name}</td>
                    <td>{event.category}</td>
                    <td>{event.type}</td>

                    <td>
                      <Date dateString={event.event_date_at} />
                    </td>
                    <td>
                      <Date dateString={event.event_date_end} />
                    </td>
                    <td>{event.event_place}</td>
                    <td>{event.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
