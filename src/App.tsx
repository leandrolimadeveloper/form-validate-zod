import { useState } from 'react';
import './styles/global.css';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginUserFormSchema = z.object({
    name: z
        .string()
        .nonempty('O campo nome é obrigatório')
        .transform((name) => {
            return name
                .trim()
                .split(' ')
                .map((word) => {
                    return word[0].toLocaleUpperCase().concat(word.substring(1));
                })
                .join(' ');
        }),
    email: z.string().nonempty('O e-mail é obrigatório').email('Formato de e-mail inválido'),
    password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

function App() {
    const [output, setOutput] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginUserFormData>({
        resolver: zodResolver(loginUserFormSchema),
    });

    function loginUser(data: any) {
        // console.log(data);

        setOutput(JSON.stringify(data, null, 2));
    }

    return (
        <main className="h-screen w-screen bg-sky-950 flex flex-col justify-center items-center text-white">
            <form onSubmit={handleSubmit(loginUser)} className="flex flex-col gap-4 p-5 w-full max-w-xs">
                <div className="flex flex-col gap-4">
                    <label htmlFor="name">Nome</label>
                    <input
                        className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                        type="text"
                        id="name"
                        {...register('name')}
                    />
                    {errors.name && <span className="text-white">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-4">
                    <label htmlFor="email">E-mail</label>
                    <input
                        className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                        type="email"
                        id="email"
                        {...register('email')}
                    />
                    {errors.email && <span className="text-white">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-4">
                    <label htmlFor="password">Senha</label>
                    <input
                        className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                        type="password"
                        id="password"
                        {...register('password')}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>

                <button className="bg-zinc-800 rounded font-semibold h-10 hover:bg-zinc-900" type="submit">
                    Logar
                </button>
            </form>
            <pre>{output}</pre>
        </main>
    );
}

export default App;
