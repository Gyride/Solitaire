$(document).ready(function(){

    let deck;

    function Deck() {
        this.order = [];
    }

    function Card(suit, val, face) {
        this.suit = suit;
        this.val = val;
        this.face = face;
        this.img = "img/" + suit + val + ".png";
    }

    Deck.prototype.topDeck = function() {
        const TOP_CARD = this.order.length - 1;
        return this.order[TOP_CARD];
    }

    Deck.prototype.removeCard = function() {
        this.order.splice(-1, 1);
    }

    Deck.prototype.addCard = function(card) {
        this.order.push(card);
    }

    Deck.prototype.stack = function(i) {
        return this.order.slice(i-1);
    }

    Deck.prototype.removeStack = function(i) {
        this.order.splice(i-1, this.order.length-1);
    }

    Deck.prototype.addStack = function(stack) {
        this.order = this.order.concat(stack);
    }

    $.fn.reset = function() {

        Deck.prototype.fillDeck = function() {
            for(let i=1; i <= 13; i++) {
                this.addCard(new Card("s", i, 'down'));
                this.addCard(new Card("h", i, 'down'));
                this.addCard(new Card("c", i, 'down'));
                this.addCard(new Card("d", i, 'down'));
            }

            return this;
        }

        Deck.prototype.shuffle = function() {
            let curr = this.order.length, 
                temp, 
                rand;

            while(curr) {

                rand = Math.floor(Math.random() * curr--);
                
                temp = this.order[curr];
                this.order[curr] = this.order[rand];
                this.order[rand] = temp;
            }

            return this;
        }

        deck = new Deck();
        
        deck.fillDeck().shuffle();

        $("#deck").removeData();
        $("#draw").removeData();
        $(".pile").removeData();

        $("#deck").data('stack', deck);
        $("#draw").data('stack', new Deck());

        for (let i=1; i < 5; i++) {
            $("#foundation .pile:nth-child(" + i + ")").data('stack', new Deck());
        }
        
        for (let i=1; i < 8; i++) {
            $("#tableau .pile:nth-child(" + i + ")").data('stack', new Deck());

            for (let j=i; j > 0; j--) {
                let stack = $("#deck").data('stack');
                let card = stack.topDeck();

                if (j == 1) {
                    card.face = "up";
                    stack.removeCard();
                    
                    $("#tableau .pile:nth-child(" + i + ")").data('stack').addCard(card);
                    $('<div class="card"></div>').appendTo('#tableau .pile:nth-child(' + i + ')')
                                                    .draggable({revert: function(is_valid_drop) {
                                                                    if (!is_valid_drop) {
                                                                        let c = 10 * $(this).index();
                                                                        if ( $(this).is(":last-child") ) {
                                                                            $(this).parent().data('stack').addCard( $(this).data('card') );
                                                                        } else {
                                                                            
                                                                        }
                                                                        $(this).css("left", "0px");
                                                                        $(this).css("top", c + "px");
                                                                        $(this).css('z-index', 'auto');
                                                                    }
                                                                },
                                                                start: function() {
                                                                    if ( $(this).is(":last-child") ) {
                                                                        $(this).parent().data('stack').removeCard();
                                                                    } else {
        
                                                                    }
                                                                    $(this).css('z-index', '1000');
                                                                },
                                                                stop: function() {
                                                                    $(this).css('z-index', 'auto');
                                                                }
                    });

                    let c = 10 * ( $("#tableau .pile:nth-child(" + i + ") .card").last().index() );
                    $("#tableau .pile:nth-child(" + i + ") .card").last().css("top", c + "px");
                    $("#tableau .pile:nth-child(" + i + ") .card").last().data('card', card);
                    $("#tableau .pile:nth-child(" + i + ") .card").last().css("background-image", "url(" + card.img + ")");
                } else {
                    stack.removeCard();
                    
                    $("#tableau .pile:nth-child(" + i + ")").data('stack').addCard(card);
                    $('<div class="card"></div>').appendTo('#tableau .pile:nth-child(' + i + ')')
                                                    .draggable({revert: function(is_valid_drop) {
                                                                    if (!is_valid_drop) {
                                                                        let c = 10 * $(this).index();
                                                                        if ( $(this).is(":last-child") ) {
                                                                            $(this).parent().data('stack').addCard( $(this).data('card') );
                                                                        } else {
                                                                            
                                                                        }
                                                                        $(this).css("left", "0px");
                                                                        $(this).css("top", c + "px");
                                                                        $(this).css('z-index', 'auto');
                                                                    }
                                                                },
                                                                start: function() {
                                                                    if ( $(this).is(":last-child") ) {
                                                                        $(this).parent().data('stack').removeCard();
                                                                    } else {
                                                                        
                                                                    }
                                                                    $(this).css('z-index', '1000');
                                                                },
                                                                stop: function() {
                                                                    $(this).css('z-index', 'auto');
                                                                }
                    });

                    let c = 10 * ( $("#tableau .pile:nth-child(" + i + ") .card").last().index() );
                    $("#tableau .pile:nth-child(" + i + ") .card").last().css("top", c + "px");
                    $("#tableau .pile:nth-child(" + i + ") .card").last().data('card', card);
                    $("#tableau .pile:nth-child(" + i + ") .card").last().css("background-image", "url(img/faceDown.jpg)");
                }
            }
        }
    
    }

    $(document).reset();

    $("#tableau .pile").droppable({
        accept: function(d) {
            let topCard = $(this).data('stack').topDeck();
            let card = d.data('card');

            if (card.face == "down") {
                return false;
            }

            if ( topCard ) {
                if (topCard.face == "down") {
                    return false;
                }

                if( card.suit == "c" || card.suit == "s" ) {
                    if ( topCard.suit == "d" || topCard.suit == "h" ) {
                        if ( card.val == topCard.val - 1 ) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    if ( topCard.suit == "c" || topCard.suit == "s" ) {
                        if ( card.val == topCard.val - 1 ) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                if (card.val == 13) {
                    return true;
                }
            }
        },
        drop: function( event, ui ) {
            let droppable = $(this);
            let draggable = ui.draggable;
            // Move draggable into droppable
            draggable.appendTo(droppable);
            draggable.css("position", "absolute");

            let c = 10 * (draggable.index());
            draggable.css("top", c + "px");
            draggable.css("left", "0px");
            droppable.data('stack').addCard( draggable.data('card') );
         }
     
    });

    $("#foundation .pile").droppable({
        accept: function(d) {
            let topCard = $(this).data('stack').topDeck();
            let card = d.data('card');

            if (card.face == "down") {
                return false;
            }

            if ( topCard ) {
                if (topCard.face == "down") {
                    return false;
                }

                if(card.suit == topCard.suit && card.val == topCard.val + 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (card.val == 1) {
                    return true;
                }
            }
        },
        drop: function( event, ui ) {
            let droppable = $(this);
            let draggable = ui.draggable;
            // Move draggable into droppable
            draggable.appendTo(droppable);
            draggable.css("position", "absolute");
            draggable.css("top", "0px");
            draggable.css("left", "0px");
            droppable.data('stack').addCard( draggable.data('card') );
         }
     
    });

    $("#deck").on("click", function(){
        let deckStack = $(this).data('stack');
        let card = deckStack.topDeck();

        if(card) {
            card.face = "up";
            deckStack.removeCard();
    
            $('<div class="card"></div>').appendTo('#draw')
                                            .draggable({revert: function(is_valid_drop) {
                                                            if (!is_valid_drop) {
                                                                let c = $(this).index();
                                                                if ( $(this).is(":last-child") ) {
                                                                    $(this).parent().data('stack').addCard( $(this).data('card') );
                                                                } else {

                                                                }
                                                                $(this).css("left", "0px");
                                                                $(this).css("top", c + "px");
                                                                $(this).css('z-index', 'auto');
                                                            }
                                                        },
                                                        start: function() {
                                                            if ( $(this).is(":last-child") ) {
                                                                $(this).parent().data('stack').removeCard();
                                                            } else {

                                                            }
                                                            $(this).css('z-index', '1000');
                                                        },
                                                        stop: function() {
                                                            $(this).css('z-index', 'auto');
                                                        }
            });
            let drawStack = $("#draw").data('stack');
            drawStack.addCard(card);
    
            $("#draw .card").last().data('card', card);
            $("#draw .card").last().css("background-image", "url(" + card.img + ")");
            if ( deckStack.order.length < 1 ) {
                $(this).css("background-image", "url(img/reset.png)");
                $(this).css("background-size", "contain");
                $(this).css("background-position", "center");
                $(this).css("background-repeat", "no-repeat");
            }
        } else {
            let drawStack = $("#draw").data('stack');
            $("#draw").data('stack', new Deck());
            $("#draw").empty();

            drawStack.order.reverse();
            $(this).data('stack', drawStack);
            $(this).css("background-image", "url(img/faceDown.jpg)");
            $(this).css("background-size", "cover");
        }
    });

    $(".pile").on("click", ".card", function(){
        let card = $(this).data('card');
        if ( card.face == "down" ) {
            if ( $(this).is(':last-child') ) {
                card.face = "up";
                $(this).css("background-image", "url(" + $(this).data('card').img + ")");
            }
        }
    });
});