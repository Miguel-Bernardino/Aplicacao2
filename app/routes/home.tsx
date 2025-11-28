import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link 
          to="/guitar-hero" 
          style={{ 
            padding: '15px 30px', 
            fontSize: '1.5em',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            display: 'inline-block',
            fontWeight: 'bold'
          }}
        >
          🎸 Jogar Guitar Hero
        </Link>
      </div>
    </div>
  );
}
