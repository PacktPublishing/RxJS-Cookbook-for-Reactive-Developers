import { Link, useLoaderData } from "react-router-dom";

export function Home() {
    const user = useLoaderData();
    
    return <>
        <h2>Home</h2>
        <nav>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        {JSON.stringify(user)}
    </>;
}