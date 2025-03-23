interface Search {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}
export default function Search({ searchTerm, setSearchTerm }: Search) {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="" />
        <input
          placeholder="Search through thousands of movies"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
