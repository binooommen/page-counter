import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

axios.defaults.baseURL = "http://localhost:3000";
function Pages() {
  const [pages, setPages] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await axios.get('/api/pages');
      setPages(res.data);
    } catch (err) {
      console.error('Error fetching pages:', err);
    }
  };

  const handleAddPage = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPage = {
      name: name.trim(),
      reference: uuidv4()
    };

    try {
      await axios.post('/api/pages', newPage);
      setName('');
      fetchPages();
    } catch (err) {
      console.error('Error adding page:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      await axios.delete(`/api/pages/${id}`);
      fetchPages();
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  return (
    <div class="container">
        <div class="jumbotron">
            <h1>Page Counter</h1>      
            <p>Keep it counting...</p>      
        </div>
        <div class="tab-content">
          <div class="panel panel-default tab-pane active" id="pagesPanel">
            <div class="panel-heading">
                <form onSubmit={handleAddPage} className="flex gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Enter page name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Add Page
                  </button>
                </form>
            </div>

            <table id="pages_tbl" className="table table-striped">
              <thead>
                <tr>
                  {['ID', 'Name', 'Reference', 'Count', 'Created', 'Updated', 'Copy Script', 'Actions'].map((heading) => (
                    <th key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      No pages found.
                    </td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page.id}>
                      <td className="px-4 py-2 border-b">{page.id}</td>
                      <td className="px-4 py-2 border-b">{page.name}</td>
                      <td className="px-4 py-2 border-b text-xs break-all">{page.reference}</td>
                      <td className="px-4 py-2 border-b">{page.count}</td>
                      <td className="px-4 py-2 border-b">{new Date(page.create_date).toLocaleString()}</td>
                      <td className="px-4 py-2 border-b">{new Date(page.update_date).toLocaleString()}</td>
                      <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => {
                          const script = `<script>
                            window.addEventListener("DOMContentLoaded", async () => {
                              try {
                                const res = await fetch("http://localhost:3000/api/pages/increment/${page.reference}", {
                                  method: "POST"
                                });
                          
                                const data = await res.json();
                                if (data.count !== undefined) {
                                  document.getElementById("view-counter").innerText = \`This story has been viewed \${data.count} times!\`;
                                } else {
                                  document.getElementById("view-counter").innerText = \`Could not get view count 😕\`;
                                }
                              } catch (error) {
                                console.error("Error:", error);
                                document.getElementById("view-counter").innerText = \`Error fetching view count. Check console.\`;
                              }
                            });
                          <\/script>`;
                    
                          navigator.clipboard.writeText(script).then(() => {
                            alert("Script copied to clipboard!");
                          });
                        }}
                        class="btn btn-warning"
                      >
                        Copy script
                      </button>
                    </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => handleDelete(page.id)}
                          class="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

export default Pages;