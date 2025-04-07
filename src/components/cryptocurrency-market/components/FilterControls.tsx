
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronUp, ChevronDown } from "lucide-react";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortField: string;
  setSortField: (value: string) => void;
  sortDirection: "asc" | "desc";
  toggleSortDirection: () => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortDirection,
  toggleSortDirection,
  timeRange,
  setTimeRange
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cryptocurrency..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market_cap_usd">Market Cap</SelectItem>
                <SelectItem value="current_price_usd">Price</SelectItem>
                <SelectItem value="price_change_percentage_24h">24h Change</SelectItem>
                <SelectItem value="volume_24h_usd">Volume</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={toggleSortDirection}>
              {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            
            <Button variant="outline" size="icon" className="md:hidden">
              <Filter size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
