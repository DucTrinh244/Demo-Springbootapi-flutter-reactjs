const MainContent = () => {
    return (
      <main className="flex flex-col items-center px-4 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Great outcomes <span className="font-normal">start with Jira</span>
        </h1>
        <p className="text-gray-600 max-w-xl mb-8">
          The only project management tool you need to plan and track work across every team.
        </p>
  
        <form className="w-full max-w-md space-y-4">
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-full font-medium hover:bg-blue-700 transition">
            Sign up
          </button>
          <div className="flex items-center justify-center space-x-4 text-gray-500">
            <span className="h-px w-16 bg-gray-300"></span>
            <span>Or continue with</span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center border px-4 py-2 rounded-full text-sm space-x-2">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span>Google</span>
            </button>
            <button className="flex items-center border px-4 py-2 rounded-full text-sm space-x-2">
              <img src="https://www.svgrepo.com/show/452213/microsoft.svg" className="w-5 h-5" alt="Microsoft" />
              <span>Microsoft</span>
            </button>
          </div>
        </form>
      </main>
    );
  };
  
  export default MainContent;
  