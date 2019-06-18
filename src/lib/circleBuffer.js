
export default class CircleBuffer 
{
    constructor( ...args )
    {
        if( args.length == 1 & Array.isArray( args[0] ) )
        {
            this.data = new Array( args[0].length );
            this.capacity = args[0].length;
            this.used = 0;
            this.head = 0;
            this.push( ...args[0] );
            return this;
        }

        if( args.length == 1 & typeof args[0] === "number" )
        {
            this.data = new Array( args[0] );
            this.capacity = args[0]
            this.used = 0;
            this.head = 0;
            return this;
        }

        if( args.length > 1 )
        {
            this.data = new Array( args.length );
            this.capacity = args.length;
            this.used = 0;
            this.head = 0;
            this.push( ...args );
            return this;
        }

        throw new Error( "Expected ( number | [ ... ] | arg1, arg3, ... )" );
    }

    get length()
    {
        return this.used;
    }
    get empty()
    {
        return this.used === 0;
    }
    get full()
    {
        return !(this.used < this.capacity);
    }
    push( ...args )
    {
        for( let i = 0; i < args.length; i++ )
        {
            if( this.full ) break;
            this.data[ ( this.head + this.used++ ) % this.capacity ] = args[i]; 
        }
        return this.used;
    }

    // if collection is full, growth from tail will occupy the head of 
    // the collection and the head of the list will be advanced accorrdingly
    // return replaced elements
    pushOver( ...args )
    {
        let tmp = [];
        let n   = 0;

        for( let i = 0; i < args.length; i++ )
        {
            if( this.full )
            {
                n = ( this.head++ + this.used ) % this.capacity;
                tmp.push( this.data[ n ] );
                this.data[ n ] = args[ i ]; 
            }
            else
            {
                this.data[ ( this.head + this.used++ ) % this.capacity ] = args[i]; 
            }
        }
        return tmp;
    }
    pop()
    {
        if( this.empty ) return;
        let lst = ( this.head + this.used-1 ) % this.capacity;
        let tmp = this.data[ lst ];
        this.data[ lst ] = undefined;
        this.used--;
        return tmp;
    }
    unshift( ...args )
    {
        for( let i = 0; i < args.length; i++ )
        {
            if( this.full ) break;
            let fst;
            if( this.empty ) fst = this.head = this.capacity - 1;
            else             fst = (--this.head + this.capacity) % this.capacity;
            this.data[ fst ] = args[i]; 
            this.used++;

        }
        return this.used;
    }
    // if collection is full, growth from head will occupy the tail of 
    // the collection and the head of the list will be receded accorrdingly
    // return replaced elements
    unshiftOver( ...args )
    {
        let tmp = [];
        let n   = 0;

        for( let i = 0; i < args.length; i++ )
        {
            if( this.full )
            {
                n = this.head = (--this.head + this.capacity) % this.capacity;
                tmp.push( this.data[ n ] );
                this.data[ n ] = args[ i ]; 
            }
            else
            {
                if( this.empty ) n = this.head = this.capacity - 1;
                else             n = this.head = (--this.head + this.capacity) % this.capacity;
                this.data[ n ] = args[ i ]; 
                this.used++;
            }
        }
        return tmp;
    }
    shift()
    {
        if( this.empty ) return;
        let tmp = this.data[ this.head ];
        this.data[ this.head ] = undefined;
        this.head = ( this.head + 1 ) % this.capacity;
        this.used--;

        return tmp;
    }
    toArray()
    {
        if( this.empty ) return [];
        let tmp = new Array( this.length );
        for( let i = 0; i < this.length; i++ )
        {
            tmp[i] = this.data[ (this.head + i) % this.capacity ];
        }
        return tmp;
    }
    each( fn, thisArg=null )
    {
        let n = 0;
        for( let i = 0; i < this.length; i++ )
        {
            n = (this.head + i) % this.capacity;
            fn.call( thisArg, this.data[ n ], n, this.data );
        }
    }
}
