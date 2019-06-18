const SubClassFactory = require( '../util/subclass.factory' );

const $head   = Symbol( 'head'   );
const $tail   = Symbol( 'tail'   );
const $length = Symbol( 'length' );
const $prev   = Symbol( 'prev'   );
const $next   = Symbol( 'next'   );
const $isList = Symbol( 'isList' );
const $isNode = Symbol( 'isNode' );

///////////////////////////////////////////////////////////////////////////////////////////////////
function ensureList( x )
{
	if( !x[$isList]) throw 'Invalid Parameter for AbstractList';
	return x;
}
function ensureNode( x )
{
	if( !x[$isNode]) throw 'Invalid Parameter for AbstractListNode';
	return x;
}
function link( node, prev, next )
{
	node[$prev] = prev;
	node[$next] = next;
	return node;
}
///////////////////////////////////////////////////////////////////////////////////////////////////
const AbstractListNode = SubClassFactory(
	function( TYPE )
	{
		return class AbstractListNode extends TYPE
		{
			constructor( ...args )
			{
				super( ...args );
				this[$prev] = prev;
				this[$next] = next;
			}
			get [$isNode]()
			{
				return true;
			}
		}
	}
);

class Adapter
{
	/////////////////////////////////////////////////////////////////////////////////////
	static Node( TYPE )
	{
		return AbstractListNode;
	}
	static List( TYPE )
	{
		return class List extends TYPE
		{
			constructor( ...args )
			{
				super( ...args );
				this[$head]   = null;
				this[$tail]   = null;
				this[$length] = 0;
			}
			get [$isList]()
			{
				return true;
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////
	static length( list )
	{
		ensureList(list);
		return list[$length];
	}
	static empty( list )
	{
		ensureList(list);
		return (list[$head] === null) && (list[$tail] === null);
	}
	static clear( list )
	{
		ensureList(list);
		list[$head]   = null;
		list[$tail]   = null;
		list[$length] = 0;
	}
	static push( list, node )
	{
		ensureList(list);
		ensureNode(node);
		link( node, list[$tail], null );
		if( Adapter.empty(list) ) list[$head] = list[$tail] = node ;
		else list[$tail][$next] = (list[$tail] = node );
		list[$length]++;
	}
	static unshift( list, node )
	{
		ensureList(list);
		ensureNode(node);
		link( node, null, list[$head] );
		if( Adapter.empty(list) ) list[$head] = list[$tail] = node ;
		else list[$head][$prev] = (list[$head] = node );
		list[$length]++;
	}
	static pop( list )
	{
		ensureList(list);
		let node = null;
		if( (node = list[$tail]) )
		{
			if( node[$prev] ) (list[$tail] = node[$prev])[$next] = null;
			else list[$tail] = list[$head] = null;
			list[$length]--;
		}
		return node;
	}
	static shift( list )
	{
		ensureList(list);
		let node = null;
		if( (node = list[$head]) )
		{
			if( node[$next] ) (list[$head] = node[$next])[$prev] = null;
			else list[$tail] = list[$head] = null;
			list[$length]--;
		}
		return node;
	}
	static remove( list, node )
	{
		ensureList(list);
		ensureNode(node);
		if( list[$head] === node ) return Adapter.shift( list );
		if( list[$tail] === node ) return Adapter.pop( list );
		list[$length]--;
		return ((node[$prev][$next] = node[$next])[$prev] = node[$prev]);
	}
	static each( list, func )
	{
		ensureList(list);
		let node = list[$head];
		while( node )
		{
			func( node );
			node = node[$next];
		}
	}
	static isHead( list, node )
	{
		ensureList(list);
		ensureNode(node);
		return list[$head] === node;
	}
	static isTail( list, node )
	{
		ensureList(list);
		ensureNode(node);
		return list[$tail] === node;
	}
	static head( list )
	{
		ensureList(list);
		return list[$head];
	}
	static tail( list )
	{
		ensureList(list);
		return list[$tail];
	}
	static prev( node )
	{
		ensureNode(node);
		return node[$prev];
	}
	static next( node )
	{
		ensureNode(node);
		return node[$next];
	}
	/////////////////////////////////////////////////////////////////////////////////////
	constructor( source )
	{
		this.source = source;
	}
	get length()
	{
		return Adapter.length( this.source );
	}
	get empty()
	{
		return Adapter.empty( this.source );
	}

	clear()
	{
		Adapter.clear( this.source );
		return this;
	}
	push( node )
	{
		Adapter.push( this.source, node );
		return this;
	}
	unshift( node )
	{
		Adapter.unshift( this.source, node );
		return this;
	}
	pop()
	{
		return Adapter.pop( this.source );
	}
	shift()
	{
		return Adapter.shift( this.source );
	}
	remove( node )
	{
		return Adapter.remove( this.source, node );
	}
	each( func )
	{
		Adapter.each( this.source, func );
	}
	/////////////////////////////////////////////////////////////////////////////////////
}
///////////////////////////////////////////////////////////////////////////////////////////////////
module.exports =  Adapter;