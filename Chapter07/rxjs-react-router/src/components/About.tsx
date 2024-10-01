import { Link, useLoaderData } from "react-router-dom";

export function About() {
    const recipeDetails = useLoaderData();

    return (
        <>
            <h2>About</h2>
            <ul>
                <Link to={`/home/123`}>Home</Link>
            </ul>
            {JSON.stringify(recipeDetails)}
        </>
    );
  }