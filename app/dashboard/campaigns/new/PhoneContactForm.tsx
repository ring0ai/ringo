"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trash2, Upload, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateCampaignSchema } from "@/lib/validators";

type PhoneContact = CreateCampaignSchema["contacts"][number];

export function PhoneContactsForm({
  contacts,
  updateContact,
}: {
  contacts: PhoneContact[];
  updateContact: (contacts: PhoneContact[]) => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleAddContact = () => {
    if (name.trim() && number.trim()) {
      const newContact: PhoneContact = {
        id: Date.now().toString(),
        name: name.trim(),
        number: number.trim(),
      };
      updateContact([...contacts, newContact]);
      setName("");
      setNumber("");
    }
  };

  const handleDeleteContact = (id: string) => {
    updateContact(contacts.filter((contact) => contact.id !== id));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoadingFile(true);
    try {
      // Dynamically import xlsx library
      const XLSX = await import("xlsx");
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Map Excel data to contacts
          const importedContacts: PhoneContact[] = jsonData
            .map((row: any, index: number) => ({
              id: `${Date.now()}-${index}`,
              name: row.name || row.Name || row.NAME || "",
              phone:
                row.phone ||
                row.Phone ||
                row.PHONE ||
                row.number ||
                row.Number ||
                "",
            }))
            .filter((contact) => contact.name.trim() && contact.phone.trim());

          if (importedContacts.length > 0) {
            updateContact([...contacts, ...importedContacts]);
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          alert(
            'Error parsing Excel file. Please ensure it has "name" and "phone" columns.',
          );
        } finally {
          setIsLoadingFile(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error loading xlsx library:", error);
      alert("Please ensure the file is a valid Excel file (.xlsx)");
      setIsLoadingFile(false);
    }

    // Reset file input
    event.target.value = "";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddContact();
    }
  };

  return (
    <div className="w-full space-y-6 sticky top-0 col-span-3">
      <CardHeader className="px-0">
        <CardTitle>Add Phone Contacts</CardTitle>
        <CardDescription>
          Manually add phone numbers or import from an Excel file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Name</label>
            <Input
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              placeholder="e.g., +1 (555) 123-4567"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleAddContact}
            disabled={!name.trim() || !number.trim()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>

          {/* Excel Import */}
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={isLoadingFile}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <Button
              variant="outline"
              disabled={isLoadingFile}
              className="flex items-center gap-2 bg-transparent"
            >
              <Upload className="h-4 w-4" />
              {isLoadingFile ? "Importing..." : "Import from Excel"}
            </Button>
          </div>
        </div>

        {/* File Format Hint */}
        <p className="text-xs text-muted-foreground">
          💡 Excel file should have columns named "name" and "phone"
          (case-insensitive)
        </p>
      </CardContent>

      {contacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contacts ({contacts.length})</CardTitle>
            <CardDescription>
              Review and manage your added phone contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Name</TableHead>
                    <TableHead className="w-1/2">Phone Number</TableHead>
                    <TableHead className="w-12 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contact.number}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {contacts.length === 0 && (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">No contacts added yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your first contact manually or import from an Excel file to
              get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
