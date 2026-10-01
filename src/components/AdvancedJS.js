import { useState } from "react";
import Demo1 from "./demos/Demo1";
import Demo2 from "./demos/Demo2";
import Demo3 from "./demos/Demo3";
import Demo4 from "./demos/Demo4";
import Demo5 from "./demos/Demo5";

const demos = [
  { id: 1, label: "DEMO-1", Component: Demo1 },
  { id: 2, label: "DEMO-2", Component: Demo2 },
  { id: 3, label: "DEMO-3", Component: Demo3 },
  { id: 4, label: "DEMO-4", Component: Demo4 },
  { id: 5, label: "DEMO-5", Component: Demo5 }
];

function AdvancedJS() {
  const [active, setActive] = useState(1);
  const current = demos.find((demo) => demo.id === active);
  const Panel = current.Component;

  return (
    <main className="extension-main">
      <section className="panel authenticity-panel">
        <h2>Statement of authenticity</h2>
        <p>I confirm that:</p>
        <ul>
          <li>This is an original assessment and is entirely my own work.</li>
          <li>
            It contains no material previously published or written by another person
            or myself except where due acknowledgement is made in the text.
          </li>
          <li>
            No material which to a substantial extent, has been submitted for any other
            academic course, is included without acknowledgement.
          </li>
        </ul>
      </section>

      <section className="panel extension-note">
        <h2>Advanced JavaScript features</h2>
        <ol>
          <li><strong>Interactive map.</strong> Leaflet shows the shop at 501 Gloucester Street and the pin can be zoomed and dragged.</li>
          <li><strong>Booking dashboard.</strong> Stored repair jobs can be searched, filtered by customer type, and sorted.</li>
          <li><strong>Repair calendar.</strong> Bookings are placed on the month of their repair date.</li>
          <li><strong>Charts.</strong> Fault category, phone make, and customer type are counted from the stored jobs.</li>
          <li><strong>Drag and drop.</strong> A courtesy phone and charger are dragged into a loan box, and the bond follows the customer type.</li>
        </ol>
      </section>

      <section className="demo-board" aria-label="Advanced JS demos">
        <h2>Extension page: Advanced JS demos</h2>
        <div className="demo-layout">
          <div className="demo-menu" role="tablist">
            {demos.map((demo) => (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={demo.id === active}
                className={demo.id === active ? "demo-tab active" : "demo-tab"}
                onClick={() => setActive(demo.id)}
              >
                {demo.label}
              </button>
            ))}
          </div>
          <div className="demo-stage" role="tabpanel">
            <Panel />
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdvancedJS;
