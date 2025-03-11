"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Client {
  id: string;
  name: string;
  email?: string;
  status?: string;
}

interface ClientSearchProps {
  clients: Client[];
}

export default function ClientSearch({ clients }: ClientSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredClients =
    search.length > 0
      ? clients.filter(
          (client) =>
            client.name.toLowerCase().includes(search.toLowerCase()) ||
            (client.email &&
              client.email.toLowerCase().includes(search.toLowerCase())),
        )
      : clients;

  return (
    <>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search clients... (⌘K)"
          className="w-full pl-8"
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search clients by name or email..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No clients found.</CommandEmpty>
          <CommandGroup heading="Clients">
            {filteredClients.map((client) => (
              <CommandItem
                key={client.id}
                onSelect={() => {
                  router.push(`/dashboard/clients/${client.id}`);
                  setOpen(false);
                }}
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-1 mr-2">
                    <UserCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>{client.name}</span>
                  {client.status && (
                    <span
                      className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${client.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {client.status}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
