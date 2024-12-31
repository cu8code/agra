export interface AppDetails {
	t: "app_details",
	name: string,
	icon_path: string,
	description?: string,
	app_id: string
}

export interface Emoji {
	t: "emoji",
	id: string,
	name: string,
	glyph: string,
}

export interface FileDetails {
		t: "file_details",
    name: string,
    path: string,
    description?: string,
}

export interface IconDetails {
		t: "icon_details",
    name: string,
    svg: string,
}

export interface HistoryEntry {
		t: "history_entry"
    entry: string,
    count: number,
    last_used: string,
}

export type RawItem =  AppDetails | Emoji | FileDetails | IconDetails | HistoryEntry

export type SuperContextType = {
	rawItem: RawItem[];
	setRawItem: React.Dispatch<React.SetStateAction<RawItem[]>>;
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	selectedIndex: number;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	resetState: () => void;

}


