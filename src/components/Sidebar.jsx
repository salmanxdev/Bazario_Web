import { Link } from "react-router-dom";

import categories from "../utils/categories";

const Sidebar = () => {

    return (

        <div className="sidebar">

            <h2 className="sidebar-title">
                Categories
            </h2>

            {

                categories.map((category) => (

                    <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="sidebar-link"
                    >

                        <div className="sidebar-item">

                            {category.name}

                        </div>

                    </Link>
                ))
            }

        </div>
    );
};

export default Sidebar;