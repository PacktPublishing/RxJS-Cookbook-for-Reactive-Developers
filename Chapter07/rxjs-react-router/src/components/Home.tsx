import { Link, useLoaderData } from "react-router-dom";

export function Home() {    
    return <>
        <h2>Home</h2>
        <nav>
          <ul>
            <li>
              <Link to="/about/123">About</Link>
            </li>
          </ul>
        </nav>
    </>;
}