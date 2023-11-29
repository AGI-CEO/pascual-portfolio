import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredSkills = skills.filter((skill) => skill.type.includes(filter));
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
        <div tabIndex={0} role="button" className="btn m-1">
          {filter ? filter : "Filter by skill type"}
        </div>
        <ul className="dropdown-content z-[1] menu  m-5 shadow bg-base-100 rounded-box  grid grid-cols-2  mx-1 px-1">
          <li>
            <a role="button" onClick={() => setFilter("")}>
              Filter by skill type
            </a>
          </li>
          {skillTypes.map((type) => (
            <li key={type}>
              <a role="button" onClick={() => setFilter(type)}>
                {type}
              </a>
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
