import React, { useEffect, useState } from "react";
import axios from "axios";

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios
      .get("api/skills")
      .then((response) => {
        setSkills(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  }, []);
  const [filter, setFilter] = useState("");

  const filteredSkills = skills.filter((skill) => skill.type.includes(filter));

  return (
    <>
      <div className="relative inline-block w-full">
        <label
          htmlFor="filter"
          className="block text-gray-300 text-sm text-center font-bold mb-2"
        >
          Filter by skill type:
        </label>
        <div className="relative">
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block appearance-none w-full bg-slate-500 border border-gray-400 hover:border-gray-500 px-4 mb-5 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">All</option>
            {Array.from(new Set(skills.map((skill) => skill.type))).map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 12l-6-6h12l-6 6z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex item-center text-center align-middle justify-center">
        <table>
          <thead className="">
            <tr>
              <th className="px-4 py-2 border border-gray-300 bg-white text-gray-600">
                Skill Name
              </th>
              <th className="px-4 py-2 border border-gray-300 bg-white text-gray-600">
                Skill Type
              </th>
            </tr>
          </thead>
          <tbody className="">
            {filteredSkills.map((skill) => (
              <tr
                key={skill.name}
                className="transition-all duration-500 ease-in-out transform hover:scale-105"
              >
                <td className="px-4 py-2 border border-gray-300 bg-white text-gray-600">
                  {skill.name}
                </td>
                <td className="px-4 py-2 border border-gray-300 bg-white text-gray-600">
                  {skill.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Skills;
