import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/pages', { state: { username: e?.target?.username?.value } });
    };
    
    return (<section>
            <div class="container">
                <h1 class="page-header">Page Counter</h1> 
                <h2>Login</h2>
                <form role="form" id="login-form" onSubmit={handleSubmit}>
                    <div class="input-group">
                        <span class="input-group-addon" id="sizing-addon2">Username</span>
                        <input type="text" class="form-control" id="username" name="username" 
                                placeholder="Username" aria-describedby="sizing-addon2"/>
                    </div>
                    <br/>
                    <div class="input-group">
                        <span class="input-group-addon" id="sizing-addon2">Password</span>
                        <input type="password" class="form-control" id="password" name="password" 
                                placeholder="Password" aria-describedby="sizing-addon2"/>
                    </div>
                    <br/>
                    <div class="input-group">
                        <input class="btn btn-default btn-lg btn-block" id="login-bt" name="login-bt" type="submit" value="Submit"/>
                    </div>
                </form>
            </div> 
        </section>
    );
}

export default Login;