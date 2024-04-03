function App() {
  return (
    <div>
      <div className="h-10 border-b flex items-center px-2">
        <span className="text-muted text-sm font-bold ">PROJECT MANAGER</span>
      </div>
      <div className="grid grid-cols-12 divide-x h-[calc(100vh-40px)]">
        <div className="col-span-3">
          <p>Projects</p>
        </div>
        <div>
          <p>Details</p>
        </div>
      </div>
    </div>
  );
}

export default App;
