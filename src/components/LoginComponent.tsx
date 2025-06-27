'use client';
const LoginComponent = () => {
    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('psw') as string;
        await login(email, password);
    };

    return (
        <div className="text-black">
            <form method="post" className="border-3 border-gray-300 rounded-lg shadow-lg p-6 bg-white" onSubmit={handleSubmit}>
                <div className="p-4">
                    <label className="pr-2"><b>email</b></label>
                    <input type="email" placeholder="Enter email" name="email" required className="w-max py-3 px-5 mx-0 my-2.5 inline-block border-1 border-solid border-[#ccc]" />

                    <label className="p-2"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required className="w-max py-3 px-5 mx-1 my-2.5 inline-block border-1 border-solid border-[#ccc]" />

                    <button type="submit" className="bg-[#04AA6D] text-white py-3.5 px-5 border-none cursor-pointer w-max hover:opacity-80" >Login</button>
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