"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ProjectCard } from "./project-card";
import { Project, ProjectWithTaskCount } from "@/lib/services";
import { searchProjectsAction } from "@/app/actions";

type ProjectSearchProps = {
  userId: string;
};

export function ProjectSearch({ userId }: ProjectSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProjectWithTaskCount[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchProjectsAction(userId, searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError("An error occurred during search");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search projects by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Search Results ({searchResults.length})
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  ...project,
                  _count: { tasks: project._count.tasks },
                }}
              />
            ))}
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && !error && (
        <p className="text-muted-foreground text-center py-8">
          No projects found matching &quot;{searchQuery}&quot;
        </p>
      )}
    </div>
  );
}
