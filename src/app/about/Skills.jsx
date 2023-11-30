import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";

const Skills = ({ skills }) => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log(`Filter is now: ${filter}`);
    let result;
    if (filter) {
      result = skills.filter((skill) => skill.type === filter);
    } else {
      result = skills;
    }
    console.log("Filtered skills:", result);
    setFilteredSkills(result);
  }, [skills, filter]);

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);

  const skillsOnCurrentPage = filteredSkills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const skillTypes = [...new Set(filteredSkills.map((skill) => skill.type))];

  return (
    <>
      {/* Filter dropdown */}
      <div className="flex dropdown mx-auto justify-center">
        <div tabIndex={0} role="button" className="btn m-1 w-full">
          {filter ? filter : "Filter by skill type"}
        </div>
        <ul className="dropdown-content z-[1] menu  m-5 shadow bg-base-100 rounded-box  grid grid-cols-2  mx-1 px-1">
          <li>
            <button
              role="button"
              onClick={() => {
                console.log("Clearing filter");
                setFilter("");
              }}
            >
              Clear filter
            </button>
          </li>
          {skillTypes.map((type) => (
            <li key={type}>
              <button
                role="button"
                onClick={() => {
                  console.log(`Setting filter to: ${type}`);
                  setFilter(type);
                }}
              >
                {type}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* ... */}
      <table className="table table-auto  m-auto text-center">
        <tbody className=" justify-center text-center">
          {skillsOnCurrentPage.map((skill) => (
            <tr
              key={skill.name}
              className="table-row transition-all duration-500 ease-in-out transform hover:scale-105"
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
        {/* ... */}
      </table>
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={filteredSkills.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        innerClass="flex space-x-2 text-center item-center justify-center mt-4"
        itemClass="page-item"
        linkClass="page-link"
      />
    </>
  );
};

export default Skills;
