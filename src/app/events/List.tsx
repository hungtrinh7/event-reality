import React, { useEffect, useState } from "react";
import { Database } from "../../../lib/schema";
import { supabase } from "../../../lib/initSupabase";
import Date from "../../app/components/date";

type Events = Database["public"]["Tables"]["events"]["Row"];

const List = () => {
  const [events, setEvents] = useState<Events[] | null>([]);

  useEffect(() => {
    const callEvents = async () => {
      const { data: userId } = await supabase
        .from("users")
        .select("id")
        .eq("email", localStorage.getItem("userEmail"));

      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .eq("author_id", parseInt(userId?.[0].id));
      setEvents(events);
    };
    callEvents();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        My events
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
  );
};

export default List;
