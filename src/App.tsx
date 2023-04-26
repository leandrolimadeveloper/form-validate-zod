import { useState } from 'react';
import './styles/global.css';

import { useForm, useFieldArray } from 'react-hook-form';
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
    email: z
        .string()
        .nonempty('O e-mail é obrigatório')
        .email('Formato de e-mail inválido')
        .toLowerCase()
        .refine((email) => {
            return email.endsWith('@rocketseat.com.br');
        }, 'O e-mail precisa ser da Rocketseat'),
    password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
    techs: z
        .array(
            z.object({
                title: z.string().nonempty('O título é obrigatório'),
                knowledge: z.coerce.number().min(1).max(100),
            })
        )
        .min(2, 'Insira pelo menos 2 tecnologias'),
});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

function App() {
    const [output, setOutput] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<LoginUserFormData>({
        resolver: zodResolver(loginUserFormSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'techs',
    });

    function addNewTech() {
        append({ title: '', knowledge: 0 });
    }

    function loginUser(data: any) {
        // console.log(data);

        setOutput(JSON.stringify(data, null, 2));
    }

    return (
        <main className="w-screen bg-blue-900 flex flex-col justify-center items-center text-white mb-5">
            <form onSubmit={handleSubmit(loginUser)} className="flex flex-col gap-4 p-5 w-full max-w-xs">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nome</label>
                    <input
                        className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                        type="text"
                        id="name"
                        {...register('name')}
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email">E-mail</label>
                    <input
                        className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                        type="email"
                        id="email"
                        {...register('email')}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Senha</label>
                    <input
                        className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                        type="password"
                        id="password"
                        {...register('password')}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="" className="flex items-center justify-between">
                        Tecnologias
                        <button onClick={addNewTech} className="text-black text-sm bg-slate-300 p-1 rounded">
                            Adicionar tech
                        </button>
                    </label>

                    {fields.map((field, index) => {
                        return (
                            <div className="flex gap-2" key={field.id}>
                                <div className="flex flex-col flex-1">
                                    <input
                                        type="text"
                                        className="w-48 border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                                        {...register(`techs.${index}.title`)}
                                    />
                                    {errors.techs?.[index]?.title && (
                                        <span className="text-red-500 text-sm">
                                            {errors.techs?.[index]?.title?.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <input
                                        className="w-20 border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-800"
                                        type="number"
                                        {...register(`techs.${index}.knowledge`)}
                                    />
                                    {errors.techs?.[index]?.knowledge && (
                                        <span className="text-red-500 text-sm">
                                            {errors.techs?.[index]?.knowledge?.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {errors.techs && <span className="text-red-500 text-sm">{errors.techs.message}</span>}
                </div>

                <button className="bg-zinc-800 rounded font-semibold hover:bg-zinc-900 p-2" type="submit">
                    Logar
                </button>
            </form>
            <pre>{output}</pre>
        </main>
    );
}

export default App;
