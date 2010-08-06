<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" omit-xml-declaration="yes"/>

<xsl:template match="conclusion">
 <p>Result: <xsl:value-of select="message/text()"/></p>
</xsl:template>

</xsl:stylesheet>
