const MobileMenu = ({ menuOpen }) => {
    return (
      menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-2 shadow">
          <a href="#" className="block text-gray-700">Features</a>
          <a href="#" className="block text-gray-700">Product guide</a>
          <a href="#" className="block text-gray-700">Templates</a>
          <a href="#" className="block text-gray-700">Pricing</a>
          <a href="#" className="block text-gray-700">Enterprise</a>
          <div className="pt-4 border-t flex flex-col space-y-2">
            <button className="text-blue-600 font-medium text-left">Sign in</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full">Get it free</button>
          </div>
        </div>
      )
    );
  };
  
  export default MobileMenu;
  