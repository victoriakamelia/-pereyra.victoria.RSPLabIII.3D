import Anuncio from "./Anuncio.js"

export default class Anuncio_Auto extends Anuncio{
    constructor( id, titulo, transaccion, descripcion, precio,puertas, KMS, potencia, revisionFrenos, revisionLuces,revisionAceite, estado){
        super(id, titulo,transaccion,descripcion,precio);

        this.puertas=puertas;
        this.KMS=KMS;
        this.potencia=potencia;
        this.frenos=revisionFrenos;
        this.luces=revisionLuces;
        this.aceite=revisionAceite;
        this.estado= estado;
        
    }
}