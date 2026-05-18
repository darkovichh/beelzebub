import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <div className="error-main">

        <div className="error-back">
            <div className="error-black-back">

                <h1>404</h1>

                <p>keçici problemlərə görə üzr istəyirik, <span className="error-color">bir neçə dəqiqə sonra təkrar yoxlayın </span>və ya</p>
                <p>bu səhivə <span className="error-color">hal hazırda əlçatmazdır</span> ya da ki sayt'da texniki işlər gedir</p>

                          
                <Link className="back-to-home" href="index.jsx"><p>Back to Home</p></Link>


            </div>
        </div>

      </div>
    </>
  );
}