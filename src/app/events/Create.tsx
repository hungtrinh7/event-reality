import React, { FormEvent, useState } from "react";
import { supabase } from "../../../lib/initSupabase";
import useUnifiedSession from "../components/Auth/useUnifiedSession";

const Create = () => {
  const [errorText, setErrorText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [responseState, setResponseState] = useState(false);
  const { isAuthenticated, user, provider } = useUnifiedSession();

  const [newEvent, setNewEvent] = useState({
    name: "",
    eventDateAt: "",
    eventDateEnd: "",
    category: "",
    type: "",
    description: "",
    authorId: "",
  });

  // const schema = z.object({
  //   name: z.string(),
  //   eventDateAt: z.string(),
  //   eventDateEnd: z.string(),
  //   category: z.string(),
  //   type: z.string(),
  //   description: z.string(),
  // });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data: userId } = await supabase
      .from("users")
      .select("id")
      .eq("email", user?.email);

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          name: newEvent.name,
          event_date_at: newEvent.eventDateAt,
          event_date_end: newEvent.eventDateEnd,
          category: newEvent.category,
          type: newEvent.type,
          description: newEvent.description,
          author_id: parseInt(userId?.[0].id),
        },
      ])
      .select();

    setResponseState(true);
    if (error) {
      setResponseText("Error: " + error);
    } else {
      setResponseText("Your event has been added!");
    }
  }

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Create a new event!
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
              value={newEvent.name}
              name="name"
              onChange={(e) => {
                setErrorText("");
                setNewEvent({ ...newEvent, name: e.target.value });
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
              value={newEvent.category}
              onChange={(e) => {
                setErrorText("");
                setNewEvent({ ...newEvent, category: e.target.value });
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
              value={newEvent.eventDateAt}
              onChange={(e) => {
                setErrorText("");
                setNewEvent({ ...newEvent, eventDateAt: e.target.value });
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
              value={newEvent.eventDateEnd}
              onChange={(e) => {
                setErrorText("");
                setNewEvent({
                  ...newEvent,
                  eventDateEnd: e.target.value,
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
              value={newEvent.type}
              onChange={(e) => {
                setErrorText("");
                setNewEvent({ ...newEvent, type: e.target.value });
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
              value={newEvent.description}
              onChange={(e) => {
                setErrorText("");
                setNewEvent({ ...newEvent, description: e.target.value });
              }}
            />
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
