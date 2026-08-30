'use server';

import { todoService } from '@/services/todo.service';
import { revalidatePath } from 'next/cache';

export async function addTodoAction(title: string) {
    // 1. Tambahkan data ke database
    await todoService.addTodo(title);
    
    // 2. Hapus cache rute utama ('/') dan PAKSA HALAMAN DI-RENDER ULANG DARI SERVER
    revalidatePath('/');
}

export async function toggleTodoAction(id: number) {
    // Ubah status tugas
    await todoService.toggleTodo(id);
    
    // Revalidasi agar UI render ulang dengan state terbaru
    revalidatePath('/');
}
