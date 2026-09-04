import React, { useState } from "react";
import "./MyItems.css";

function MyItems() {
  const [activeTab, setActiveTab] = useState("listed");

  const items = [
    {
      id: 1,
      name: "Scientific Calculator",
      category: "Electronics",
      price: 20,
      status: "Available",
      icon: "🧮",
    },
    {
      id: 2,
      name: "Engineering Mathematics Book",
      category: "Books",
      price: 15,
      status: "Borrowed",
      icon: "📘",
    },
    {
      id: 3,
      name: "Lab Coat",
      category: "Others",
      price: 25,
      status: "Available",
      icon: "🥼",
    },
  ];

  const borrowedItems = [
    {
      id: 4,
      name: "Arduino Uno",
      category: "Electronics",
      price: 30,
      status: "Borrowing",
      icon: "🔌",
    },
    {
      id: 5,
      name: "DBMS Notes",
      category: "Notes",
      price: 10,
      status: "Due Soon",
      icon: "📄",
    },
  ];

  const displayedItems =
    activeTab === "listed" ? items : borrowedItems;

  return (
    <div className="myitems-page">

      {/* HEADER */}

      <header className="myitems-header">

        <div className="myitems-brand">

          <div className="myitems-logo">
            ◇
          </div>

          <div>
            <strong>Borrow Box</strong>
            <span>Campus sharing</span>
          </div>

        </div>

        <button
          className="myitems-back"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

      </header>


      {/* MAIN */}

      <main className="myitems-container">

        <div className="myitems-heading">

          <span>MY ACTIVITY</span>

          <h1>My Items</h1>

          <p>
            Manage the items you share and borrow.
          </p>

        </div>


        {/* TABS */}

        <div className="myitems-tabs">

          <button
            className={
              activeTab === "listed"
                ? "active"
                : ""
            }
            onClick={() => setActiveTab("listed")}
          >
            Listed Items
            <span>{items.length}</span>
          </button>

          <button
            className={
              activeTab === "borrowed"
                ? "active"
                : ""
            }
            onClick={() => setActiveTab("borrowed")}
          >
            Borrowed Items
            <span>{borrowedItems.length}</span>
          </button>

        </div>


        {/* ITEMS */}

        <section className="myitems-list">

          {displayedItems.map((item) => (

            <article
              className="myitem-card"
              key={item.id}
            >

              <div className="myitem-image">
                {item.icon}
              </div>


              <div className="myitem-content">

                <div className="myitem-main">

                  <span className="myitem-category">
                    {item.category}
                  </span>

                  <h2>{item.name}</h2>

                  <p>
                    ₹{item.price} / day
                  </p>

                </div>


                <span
                  className={`myitem-status ${
                    item.status
                      .toLowerCase()
                      .replace(" ", "-")
                  }`}
                >
                  ● {item.status}
                </span>

              </div>


              <button
                className="myitem-more"
                onClick={() =>
                  alert(`${item.name} options coming soon`)
                }
              >
                ⋮
              </button>

            </article>

          ))}

        </section>


        {/* EMPTY CTA */}

        <div className="myitems-add">

          <div>
            <strong>Have something useful?</strong>

            <p>
              Share it with students on your campus.
            </p>
          </div>

          <button
            onClick={() =>
              alert("List Item page will open here")
            }
          >
            + List an Item
          </button>

        </div>

      </main>

    </div>
  );
}

export default MyItems;
