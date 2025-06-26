const LoginComponent = () => {
    return (
        <div className="text-black">
            <form action="action_page.php" method="post" className="border-3 border-gray-300 rounded-lg shadow-lg p-6 bg-white">
                <div className="p-4">
                    <label htmlFor="uname" className="pr-2"><b>Username</b></label>
                    <input type="text" placeholder="Enter Username" name="uname" required className="w-max py-3 px-5 mx-0 my-2.5 inline-block border-1 border-solid border-[#ccc]" />

                    <label htmlFor="psw" className="p-2"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required className="w-max py-3 px-5 mx-1 my-2.5 inline-block border-1 border-solid border-[#ccc]" />

                    <button type="submit" className="bg-[#04AA6D] text-white py-3.5 px-5 border-none cursor-pointer w-max hover:opacity-80">Login</button>
                </div>

                <div className="bg-[#f1f1f1] text-black p-4">
                    <button type="button" className="w-auto py-2.5 px-4.5 bg-[#f44336] max-[300px]:w-max" id="cancelbtn">Cancel</button>
                    <span className="pt-4 float-right max-[300px]:block max-[300px]:float-none">Forgot <a href="#">password?</a></span>
                </div>
            </form>
        </div>
    );
}

export default LoginComponent;