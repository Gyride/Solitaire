$(document).ready(function(){

    let deck;
    let stack;

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
        return this.order.splice(-1, 1);
    }

    Deck.prototype.addCard = function(card) {
        return this.order.push(card);
    }

    Deck.prototype.stack = function(i) {
        return this.order.slice(i);
    }

    Deck.prototype.removeStack = function(i) {
        return this.order.splice(i , this.order.length - i);
    }

    Deck.prototype.addStack = function(stack) {
        return this.order.concat(stack);
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

        $("#draw").empty();
        $(".pile").empty();        

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
                    $('<div class="card" id="' + card.suit + card.val + '""></div>').appendTo('#tableau .pile:nth-child(' + i + ')')
                                                    .draggable({revert: function(is_valid_drop) {
                                                                    if (!is_valid_drop) {
                                                                        if ( $(this).is(":last-child") ) {
                                                                            $(this).parent().data('stack').addCard( $(this).data('card') );
                                                                            $(this).css('z-index', 'auto');
                                                                        } else {
                                                                            $(this).parent().data('stack').order = $(this).parent().data('stack').addStack( stack );
                                                                        }

                                                                        $(this).parent().children().not("#container").each( function(i){
                                                                            let c = 10 * i;
                                                                            $(this).css("top", c + "px")
                                                                            $(this).css("left", "0px")
                                                                        });
                                                                    }
                                                                },
                                                                start: function() {
                                                                    if ( $(this).is(":last-child") ) {
                                                                        $(this).parent().data('stack').removeCard();
                                                                        $(this).css('z-index', '1000');
                                                                    } else {
                                                                        stack = $(this).parent().data('stack').removeStack( $(this).index() );
                                                                    }
                                                                },
                                                                stop: function() {
                                                                    if ( $(this).is(":last-child") ) {
                                                                        $(this).css('z-index', 'auto');
                                                                    } else {
                                                                        $(this).nextAll().each( function() {
                                                                            $(this).css("display", "block");
                                                                        });
                                                                        $(this).css("display", "block");
                                                                    }
                                                                },
                                                                helper: function () {
                                                                    if( $(this).is(":last-child") ) {
                                                                        return $(this);
                                                                    } else {
                                                                        let div = $("<div id='container'></div>");
                                                                        $(this).nextAll().each( function(i) {
                                                                            let c = 10 * (i + 1);
                                                                            div.append($(this).clone(true).css("z-index", "1000").css("top", c + "px"));
                                                                            $(this).css("display", "none");
                                                                        });
                                                                        div.prepend($(this).clone(true).css("z-index", "1000").css("top", "0px"));
                                                                        $(this).css("display", "none");
                                                                        div.css("z-index", "1000");
                                                                        return div;
                                                                    }
                                                                },
                                                                cursorAt: {
                                                                    top: 5,
                                                                    left: 5
                                                                }
                    });

                    let c = 10 * ( $("#tableau .pile:nth-child(" + i + ") .card").last().index() );
                    $("#tableau .pile:nth-child(" + i + ") .card").last().css("top", c + "px");
                    $("#tableau .pile:nth-child(" + i + ") .card").last().data('card', card);
                    $("#tableau .pile:nth-child(" + i + ") .card").last().css("background-image", "url(" + card.img + ")");
                } else {
                    stack.removeCard();
                    
                    $("#tableau .pile:nth-child(" + i + ")").data('stack').addCard(card);
                    $('<div class="card" id="' + card.suit + card.val + '"></div>').appendTo('#tableau .pile:nth-child(' + i + ')')
                                                    .draggable({revert: function(is_valid_drop) {
                                                                    if (!is_valid_drop) {
                                                                        if ( $(this).is(":last-child") ) {
                                                                            $(this).parent().data('stack').addCard( $(this).data('card') );
                                                                            $(this).css('z-index', 'auto');
                                                                        } else {
                                                                            $(this).parent().data('stack').order = $(this).parent().data('stack').addStack( stack );
                                                                        }

                                                                        $(this).parent().children().not("#container").each( function(i){
                                                                            let c = 10 * i;
                                                                            $(this).css("top", c + "px")
                                                                            $(this).css("left", "0px")
                                                                        });
                                                                    }
                                                                },
                                                                start: function() {
                                                                    if ( $(this).is(":last-child") ) {
                                                                        $(this).parent().data('stack').removeCard();
                                                                        $(this).css('z-index', '1000');
                                                                    } else {
                                                                        stack = $(this).parent().data('stack').removeStack( $(this).index() );
                                                                    }
                                                                },
                                                                stop: function() {
                                                                    if ( $(this).is(":last-child") ) {
                                                                        $(this).css('z-index', 'auto');
                                                                    } else {
                                                                        $(this).nextAll().each( function() {
                                                                            $(this).css("display", "block");
                                                                        });
                                                                        $(this).css("display", "block");
                                                                    }
                                                                },
                                                                helper: function () {
                                                                    if( $(this).is(":last-child") ) {
                                                                        return $(this);
                                                                    } else {
                                                                        let div = $("<div id='container'></div>");
                                                                        $(this).nextAll().each( function(i) {
                                                                            let c = 10 * (i + 1);
                                                                            div.append($(this).clone(true).css("z-index", "1000").css("top", c + "px"));
                                                                            $(this).css("display", "none");
                                                                        })
                                                                        div.prepend($(this).clone(true).css("z-index", "1000").css("top", "0px"));
                                                                        $(this).css("display", "none");
                                                                        div.css("z-index", "1000");
                                                                        return div;
                                                                    }
                                                                },
                                                                cursorAt: {
                                                                    top: 5,
                                                                    left: 5
                                                                },
                                                                disabled: true
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
            let card;
            if ( !draggable.is(":last-child") ) {
                draggable.parent().children(":gt(" + ( draggable.index() - 1 ) + ")").not("#container").each( function(){
                        card = $(this).data('card');
                        $(this).appendTo(droppable);
                        droppable.data('stack').addCard( card );
                });
            } else {
                card = $(this).data('card');
                draggable.appendTo(droppable);
                droppable.data('stack').addCard( draggable.data('card') );
            }

            droppable.children().not("#container").each( function(i){
                let c = 10 * i;
                $(this).css("top", c + "px");
                $(this).css("left", "0px");
            });
         }
    });

    $("#foundation .pile").droppable({
        accept: function(d) {
            let topCard = $(this).data('stack').topDeck();
            let card;

            if ( d.data('card') ) {
                card = d.data('card');
            } else {
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

            draggable.appendTo(droppable);
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
    
            $('<div class="card" id="' + card.suit + card.val + '"></div>').appendTo('#draw')
                                            .draggable({revert: function(is_valid_drop) {
                                                            if (!is_valid_drop) {
                                                                if ( $(this).is(":last-child") ) {
                                                                    $(this).parent().data('stack').addCard( $(this).data('card') );
                                                                    $(this).css('z-index', 'auto');
                                                                } else {
                                                                    $(this).parent().data('stack').order = $(this).parent().data('stack').addStack( stack );
                                                                }

                                                                $(this).parent().children().not("#container").each( function(i){
                                                                    let c = 10 * i;
                                                                    $(this).css("top", c + "px")
                                                                    $(this).css("left", "0px")
                                                                });
                                                            }
                                                        },
                                                        start: function() {
                                                            if ( $(this).is(":last-child") ) {
                                                                $(this).parent().data('stack').removeCard();
                                                                $(this).css('z-index', '1000');
                                                            } else {
                                                                stack = $(this).parent().data('stack').removeStack( $(this).index() );
                                                            }
                                                        },
                                                        stop: function() {
                                                            if ( $(this).is(":last-child") ) {
                                                                $(this).css('z-index', 'auto');
                                                            } else {
                                                                $(this).nextAll().each( function() {
                                                                    $(this).css("display", "block");
                                                                });
                                                                $(this).css("display", "block");
                                                            }
                                                        },
                                                        helper: function () {
                                                            if( $(this).is(":last-child") ) {
                                                                return $(this);
                                                            } else {
                                                                let div = $("<div id='container'></div>");
                                                                $(this).nextAll().each( function(i) {
                                                                    let c = 10 * (i + 1);
                                                                    div.append($(this).clone(true).css("z-index", "1000").css("top", c + "px"));
                                                                    $(this).css("display", "none");
                                                                })
                                                                div.prepend($(this).clone(true).css("z-index", "1000").css("top", "0px"));
                                                                $(this).css("display", "none");
                                                                div.css("z-index", "1000");
                                                                return div;
                                                            }
                                                        },
                                                        cursorAt: {
                                                            top: 5,
                                                            left: 5
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

            if ( drawStack.order.length == 0) {
                $(this).css("background-image", "none");
                $(this).css("background-color", "rgba(255,255,255, .2)");
            } else {
                $("#draw").data('stack', new Deck());
                $("#draw").empty();
    
                drawStack.order.reverse();
                $(this).data('stack', drawStack);
                $(this).css("background-image", "url(img/faceDown.jpg)");
                $(this).css("background-size", "cover");
            }
        }
    });

    $(".pile").on("click", ".card", function(){
        let card = $(this).data('card');
        if ( card.face == "down" ) {
            if ( $(this).is(':last-child') ) {
                card.face = "up";
                $(this).draggable("option", "disabled", false);
                $(this).css("background-image", "url(" + $(this).data('card').img + ")");
            }
        }
    });

    $("#reset").on("click", function() {
        $(document).reset();
    });
});