class BlackOrRedCardsPacket{
	
	constructor(){
		this.id=BLACKORREDCARDS;
	}
	
	parseToOutput(){}
	
	parseFromInput(buffer){
		this.show_cards = buffer.readInt();
		this.cards = [];
		var length = buffer.readInt();
		for(var i = 0; i < length; i++){
			this.cards[i] = buffer.readString();
		}
	}
	
	toString(){
		return "show_cards:"+this.show_cards+" cards:"+JSON.stringify(this.cards);
	}
}

class UserChooseColorPacket{
	constructor(uuid, deck_card, color){
		this.uuid = uuid;
		this.deck_card = deck_card;
		this.color = color;
		this.id=USERCHOOSECOLOR;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeString(this.uuid);
		this.buffer.writeInt(this.color);
		this.buffer.writeInt(this.deck_card);
		return this.buffer;
	}
	
	parseFromInput(buffer){
		this.uuid = buffer.readString();
		this.color = buffer.readInt();
		this.deck_card = buffer.readInt();
	}
	
	toString(){
		return "uuid:"+this.uuid+" deck_card:"+this.deck_card+" color:"+(color==1 ? "RED" : (color==0 ? "UNKNOWN" : "BLACK"));
	}
}